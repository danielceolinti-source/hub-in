
-- ============== ENUMS ==============
create type public.app_role as enum ('admin_master','diretor','supervisor','atendente','financeiro','posvenda','marketing');
create type public.conversation_status as enum ('open','pending','resolved','closed','waiting');
create type public.conversation_priority as enum ('low','normal','high','urgent');
create type public.message_direction as enum ('inbound','outbound','internal');
create type public.message_type as enum ('text','image','video','audio','document','sticker','system');
create type public.presence_status as enum ('online','away','busy','offline');

-- ============== COMPANIES ==============
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  brand text not null,
  brand_color text not null default '#0b3d91',
  logo_url text,
  created_at timestamptz not null default now()
);

-- ============== SECTORS ==============
create table public.sectors (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  slug text not null,
  color text default '#3b82f6',
  icon text,
  created_at timestamptz not null default now(),
  unique(company_id, slug)
);

-- ============== PROFILES ==============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  sector_id uuid references public.sectors(id) on delete set null,
  full_name text not null default '',
  email text,
  avatar_url text,
  phone text,
  job_title text,
  presence public.presence_status not null default 'offline',
  last_seen_at timestamptz default now(),
  created_at timestamptz not null default now()
);

-- ============== USER ROLES ==============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  company_id uuid references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, role, company_id)
);

-- ============== SECURITY DEFINER FUNCTIONS ==============
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.is_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role in ('admin_master','diretor','supervisor')
  );
$$;

create or replace function public.current_company_id()
returns uuid language sql stable security definer set search_path = public as $$
  select company_id from public.profiles where id = auth.uid();
$$;

create or replace function public.current_sector_id()
returns uuid language sql stable security definer set search_path = public as $$
  select sector_id from public.profiles where id = auth.uid();
$$;

-- ============== CONVERSATIONS ==============
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  sector_id uuid references public.sectors(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  contact_name text not null,
  contact_phone text not null,
  contact_avatar_url text,
  channel text not null default 'whatsapp',
  status public.conversation_status not null default 'open',
  priority public.conversation_priority not null default 'normal',
  last_message_preview text,
  last_message_at timestamptz default now(),
  unread_count int not null default 0,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.conversations(company_id, status, last_message_at desc);
create index on public.conversations(assigned_to);

-- ============== MESSAGES ==============
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  direction public.message_direction not null,
  type public.message_type not null default 'text',
  body text,
  media_url text,
  media_meta jsonb,
  is_internal boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.messages(conversation_id, created_at desc);

-- ============== NOTES ==============
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

-- ============== TAGS ==============
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  color text default '#3b82f6',
  unique(company_id, name)
);
create table public.conversation_tags (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (conversation_id, tag_id)
);

-- ============== QUICK REPLIES ==============
create table public.quick_replies (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  sector_id uuid references public.sectors(id) on delete set null,
  shortcut text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- ============== INTERNAL CHAT ==============
create table public.internal_channels (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  is_private boolean not null default false,
  is_direct boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.channel_members (
  channel_id uuid not null references public.internal_channels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (channel_id, user_id)
);
create table public.internal_messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.internal_channels(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  attachment_url text,
  created_at timestamptz not null default now()
);
create index on public.internal_messages(channel_id, created_at desc);

create or replace function public.is_channel_member(_channel uuid, _user uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.channel_members where channel_id = _channel and user_id = _user);
$$;

-- ============== ENABLE RLS ==============
alter table public.companies enable row level security;
alter table public.sectors enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notes enable row level security;
alter table public.tags enable row level security;
alter table public.conversation_tags enable row level security;
alter table public.quick_replies enable row level security;
alter table public.internal_channels enable row level security;
alter table public.channel_members enable row level security;
alter table public.internal_messages enable row level security;

-- ============== POLICIES ==============
-- companies: usuários veem a própria
create policy "view own company" on public.companies for select using (id = public.current_company_id() or public.has_role(auth.uid(),'admin_master'));
create policy "admin manage companies" on public.companies for all using (public.has_role(auth.uid(),'admin_master')) with check (public.has_role(auth.uid(),'admin_master'));

-- sectors
create policy "view company sectors" on public.sectors for select using (company_id = public.current_company_id() or public.has_role(auth.uid(),'admin_master'));
create policy "admins manage sectors" on public.sectors for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- profiles
create policy "view own profile" on public.profiles for select using (id = auth.uid());
create policy "view company profiles" on public.profiles for select using (company_id = public.current_company_id());
create policy "update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "admin manage profiles" on public.profiles for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "insert own profile" on public.profiles for insert with check (id = auth.uid());

-- user_roles
create policy "view own roles" on public.user_roles for select using (user_id = auth.uid());
create policy "admin view roles" on public.user_roles for select using (public.is_admin(auth.uid()));
create policy "admin manage roles" on public.user_roles for all using (public.has_role(auth.uid(),'admin_master')) with check (public.has_role(auth.uid(),'admin_master'));

-- conversations
create policy "company members view conversations" on public.conversations for select using (company_id = public.current_company_id());
create policy "company members create conversations" on public.conversations for insert with check (company_id = public.current_company_id());
create policy "assignee or admin update conversations" on public.conversations for update using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());
create policy "admin delete conversations" on public.conversations for delete using (public.is_admin(auth.uid()));

-- messages
create policy "view messages of company conversations" on public.messages for select using (
  exists(select 1 from public.conversations c where c.id = conversation_id and c.company_id = public.current_company_id())
);
create policy "insert messages on company conversations" on public.messages for insert with check (
  exists(select 1 from public.conversations c where c.id = conversation_id and c.company_id = public.current_company_id())
);

-- notes
create policy "view notes of company conversations" on public.notes for select using (
  exists(select 1 from public.conversations c where c.id = conversation_id and c.company_id = public.current_company_id())
);
create policy "insert notes" on public.notes for insert with check (
  exists(select 1 from public.conversations c where c.id = conversation_id and c.company_id = public.current_company_id())
  and author_id = auth.uid()
);

-- tags
create policy "view company tags" on public.tags for select using (company_id = public.current_company_id());
create policy "admin manage tags" on public.tags for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "view conversation tags" on public.conversation_tags for select using (
  exists(select 1 from public.conversations c where c.id = conversation_id and c.company_id = public.current_company_id())
);
create policy "manage conversation tags" on public.conversation_tags for all using (
  exists(select 1 from public.conversations c where c.id = conversation_id and c.company_id = public.current_company_id())
) with check (
  exists(select 1 from public.conversations c where c.id = conversation_id and c.company_id = public.current_company_id())
);

-- quick_replies
create policy "view company quick replies" on public.quick_replies for select using (company_id = public.current_company_id());
create policy "admin manage quick replies" on public.quick_replies for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- internal channels
create policy "view company channels" on public.internal_channels for select using (
  company_id = public.current_company_id() and (
    not is_private or public.is_channel_member(id, auth.uid())
  )
);
create policy "create channels in company" on public.internal_channels for insert with check (company_id = public.current_company_id());
create policy "admin manage channels" on public.internal_channels for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- channel members
create policy "view channel members if member or public" on public.channel_members for select using (
  public.is_channel_member(channel_id, auth.uid()) or exists(
    select 1 from public.internal_channels c where c.id = channel_id and c.company_id = public.current_company_id() and not c.is_private
  )
);
create policy "join channels" on public.channel_members for insert with check (
  user_id = auth.uid() and exists(select 1 from public.internal_channels c where c.id = channel_id and c.company_id = public.current_company_id())
);
create policy "leave channels" on public.channel_members for delete using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- internal_messages
create policy "members view internal messages" on public.internal_messages for select using (public.is_channel_member(channel_id, auth.uid()));
create policy "members send internal messages" on public.internal_messages for insert with check (
  sender_id = auth.uid() and public.is_channel_member(channel_id, auth.uid())
);

-- ============== TRIGGERS: profile auto-create on signup ==============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  default_company uuid;
begin
  select id into default_company from public.companies order by created_at asc limit 1;
  insert into public.profiles (id, full_name, email, company_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.email,
    default_company
  );
  insert into public.user_roles (user_id, role, company_id) values (new.id, 'atendente', default_company);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- updated_at trigger for conversations
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger conversations_touch before update on public.conversations for each row execute procedure public.touch_updated_at();

-- ============== REALTIME ==============
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.internal_messages;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.notes;

alter table public.messages replica identity full;
alter table public.conversations replica identity full;
alter table public.internal_messages replica identity full;
alter table public.profiles replica identity full;
