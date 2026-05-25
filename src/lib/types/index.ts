// Re-export database types
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from "@/integrations/supabase/types";

// Application-specific types
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  full_name: string;
  password: string;
  company_id?: string;
}

export interface ConversationWithDetails {
  id: string;
  company_id: string;
  sector_id: string | null;
  assigned_to: string | null;
  contact_name: string;
  contact_phone: string;
  contact_avatar_url: string | null;
  channel: string;
  status: "open" | "pending" | "resolved" | "closed" | "waiting";
  priority: "low" | "normal" | "high" | "urgent";
  last_message_preview: string | null;
  last_message_at: string | null;
  unread_count: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  sector_name?: string;
  sector_color?: string;
  assigned_name?: string;
  tags?: { id: string; name: string; color: string | null }[];
}

export interface MessageWithSender {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  direction: "inbound" | "outbound" | "internal";
  type: "text" | "image" | "video" | "audio" | "document" | "sticker" | "system";
  body: string | null;
  media_url: string | null;
  media_meta: Record<string, unknown> | null;
  is_internal: boolean;
  read_at: string | null;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

export interface InternalChannelWithDetails {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  is_direct: boolean;
  created_by: string | null;
  created_at: string;
  members_count?: number;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
}

export interface DashboardStats {
  active_conversations: number;
  avg_response_time: number;
  agents_online: number;
  total_agents: number;
  resolution_rate: number;
  volume_24h: { hour: string; inbound: number; outbound: number }[];
  by_sector: { name: string; value: number }[];
  top_agents: { id: string; name: string; sector: string; conversations: number; avg_time: string }[];
  sla_data: { label: string; value: number; color: string }[];
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface RealtimePayload<T = unknown> {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: T;
  old: T;
}