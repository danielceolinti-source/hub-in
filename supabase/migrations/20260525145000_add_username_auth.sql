-- ============== ADD USERNAME TO PROFILES ==============
-- Add username field (unique) for login instead of email
alter table public.profiles add column if not exists username text unique;
alter table public.profiles add column if not exists password_reset_token text;
alter table public.profiles add column if not exists password_reset_expires timestamptz;

-- Create index on username for fast lookups
create index if not exists idx_profiles_username on public.profiles(username);

-- ============== CREATE NOTIFICATION TABLE ==============
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'info',
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);
alter table public.notifications enable row level security;
create policy "view own notifications" on public.notifications for select using (user_id = auth.uid());
create policy "insert own notifications" on public.notifications for insert with check (user_id = auth.uid());
create policy "update own notifications" on public.notifications for update using (user_id = auth.uid());

alter publication supabase_realtime add table public.notifications;
alter table public.notifications replica identity full;

-- ============== CREATE TYPING INDICATOR TABLE ==============
create table if not exists public.typing_indicators (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_typing boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);
alter table public.typing_indicators enable row level security;
create policy "view typing indicators" on public.typing_indicators for select using (
  exists(select 1 from public.conversations c where c.id = conversation_id and c.company_id = public.current_company_id())
);
create policy "manage own typing" on public.typing_indicators for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter publication supabase_realtime add table public.typing_indicators;
alter table public.typing_indicators replica identity full;

-- ============== FUNCTION: AUTH WITH USERNAME ==============
create or replace function public.get_email_by_username(_username text)
returns text language sql stable security definer set search_path = public as $$
  select email from public.profiles where username = _username and email is not null limit 1;
$$;

-- ============== FUNCTION: SIGN IN WITH USERNAME ==============
-- This will be called from client-side to look up email by username
-- Then the client uses the email with supabase.auth.signInWithPassword

-- ============== UPDATE TRIGGER FOR NEW USERS ==============
-- Modified handler to auto-generate username from email if not provided
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  default_company uuid;
  _username text;
  _full_name text;
  _email text;
begin
  select id into default_company from public.companies order by created_at asc limit 1;
  _email := new.email;
  _full_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(_email, '@', 1));
  _username := coalesce(
    new.raw_user_meta_data->>'username',
    lower(regexp_replace(split_part(_email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'))
  );
  -- Ensure unique username
  while exists(select 1 from public.profiles where username = _username) loop
    _username := _username || '_' || substr(gen_random_uuid()::text, 1, 4);
  end loop;
  insert into public.profiles (id, full_name, email, username, company_id)
  values (new.id, _full_name, _email, _username, default_company);
  insert into public.user_roles (user_id, role, company_id) values (new.id, 'atendente', default_company);
  return new;
end;
$$;

-- ============== CREATE MESSAGE REACTIONS TABLE ==============
create table if not exists public.message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null,
  created_at timestamptz not null default now(),
  unique(message_id, user_id, reaction)
);
alter table public.message_reactions enable row level security;
create policy "view reactions" on public.message_reactions for select using (
  exists(select 1 from public.messages m join public.conversations c on c.id = m.conversation_id where m.id = message_id and c.company_id = public.current_company_id())
);
create policy "manage own reactions" on public.message_reactions for all using (user_id = auth.uid()) with check (user_id = auth.uid());