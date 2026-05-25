import { supabase } from "@/integrations/supabase/client";
import type { InternalChannelWithDetails } from "@/lib/types";

export class InternalChatService {
  static async getChannels(companyId: string) {
    const { data: channels, error } = await supabase
      .from("internal_channels")
      .select(`
        *,
        channel_members!inner(user_id)
      `)
      .eq("company_id", companyId)
      .order("name");

    if (error) throw error;

    const result: InternalChannelWithDetails[] = [];
    for (const ch of channels as any[]) {
      const { count } = await supabase
        .from("channel_members")
        .select("*", { count: "exact", head: true })
        .eq("channel_id", ch.id);

      const { data: lastMsg } = await supabase
        .from("internal_messages")
        .select("body, created_at")
        .eq("channel_id", ch.id)
        .order("created_at", { ascending: false })
        .limit(1);

      result.push({
        id: ch.id,
        company_id: ch.company_id,
        name: ch.name,
        description: ch.description,
        is_private: ch.is_private,
        is_direct: ch.is_direct,
        created_by: ch.created_by,
        created_at: ch.created_at,
        members_count: count || 0,
        last_message: lastMsg?.[0]?.body,
        last_message_at: lastMsg?.[0]?.created_at,
      });
    }

    return result;
  }

  static async createChannel(data: {
    company_id: string;
    name: string;
    description?: string;
    is_private?: boolean;
    created_by: string;
  }) {
    const { data: channel, error } = await supabase
      .from("internal_channels")
      .insert({
        company_id: data.company_id,
        name: data.name,
        description: data.description,
        is_private: data.is_private || false,
        created_by: data.created_by,
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-join creator
    await supabase
      .from("channel_members")
      .insert({ channel_id: channel.id, user_id: data.created_by });

    return channel;
  }

  static async getMessages(channelId: string) {
    const { data, error } = await supabase
      .from("internal_messages")
      .select(`
        *,
        sender:profiles!internal_messages_sender_id_fkey(full_name, avatar_url)
      `)
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) throw error;

    return (data || []).map((m: any) => ({
      ...m,
      sender_name: m.sender?.full_name || "Desconhecido",
      sender_avatar: m.sender?.avatar_url || null,
    }));
  }

  static async sendMessage(data: {
    channel_id: string;
    sender_id: string;
    body: string;
  }) {
    const { data: msg, error } = await supabase
      .from("internal_messages")
      .insert({
        channel_id: data.channel_id,
        sender_id: data.sender_id,
        body: data.body,
      })
      .select(`*, sender:profiles(full_name, avatar_url)`)
      .single();

    if (error) throw error;
    return msg;
  }

  static async getMembers(channelId: string) {
    const { data, error } = await supabase
      .from("channel_members")
      .select(`*, profile:profiles(full_name, avatar_url, job_title, presence)`)
      .eq("channel_id", channelId);

    if (error) throw error;
    return (data || []).map((m: any) => m.profile);
  }

  static async joinChannel(channelId: string, userId: string) {
    const { error } = await supabase
      .from("channel_members")
      .insert({ channel_id: channelId, user_id: userId });
    if (error) throw error;
  }

  static async leaveChannel(channelId: string, userId: string) {
    const { error } = await supabase
      .from("channel_members")
      .delete()
      .eq("channel_id", channelId)
      .eq("user_id", userId);
    if (error) throw error;
  }

  static subscribeToMessages(channelId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`internal-messages-${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "internal_messages",
          filter: `channel_id=eq.${channelId}`,
        },
        callback
      )
      .subscribe();
  }
}