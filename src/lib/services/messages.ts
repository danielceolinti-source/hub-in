import { supabase } from "@/integrations/supabase/client";
import type { MessageWithSender } from "@/lib/types";

export class MessagesService {
  static async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(full_name, avatar_url)
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return (data || []).map((m: any) => ({
      ...m,
      sender_name: m.sender?.full_name || null,
      sender_avatar: m.sender?.avatar_url || null,
    })) as MessageWithSender[];
  }

  static async sendMessage(data: {
    conversation_id: string;
    sender_id: string;
    direction: "inbound" | "outbound" | "internal";
    body: string;
    type?: string;
    is_internal?: boolean;
  }) {
    const { data: result, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: data.conversation_id,
        sender_id: data.sender_id,
        direction: data.direction as any,
        body: data.body,
        type: (data.type || "text") as any,
        is_internal: data.is_internal || false,
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation preview
    await supabase
      .from("conversations")
      .update({
        last_message_preview: data.body.substring(0, 100),
        last_message_at: new Date().toISOString(),
      })
      .eq("id", data.conversation_id);

    return result;
  }

  static async sendInternalNote(data: {
    conversation_id: string;
    author_id: string;
    body: string;
  }) {
    const { data: result, error } = await supabase
      .from("notes")
      .insert({
        conversation_id: data.conversation_id,
        author_id: data.author_id,
        body: data.body,
      })
      .select(`*, author:profiles(full_name, avatar_url)`)
      .single();

    if (error) throw error;
    return result;
  }

  static async getNotes(conversationId: string) {
    const { data, error } = await supabase
      .from("notes")
      .select(`*, author:profiles(full_name, avatar_url)`)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async markAsRead(messageIds: string[]) {
    const { error } = await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", messageIds);

    if (error) throw error;
  }

  static subscribeToMessages(conversationId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        callback
      )
      .subscribe();
  }

  static async setTypingIndicator(conversationId: string, userId: string, isTyping: boolean) {
    const { error } = await supabase
      .from("typing_indicators")
      .upsert(
        {
          conversation_id: conversationId,
          user_id: userId,
          is_typing: isTyping,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "conversation_id, user_id" }
      );

    if (error) console.error("Typing indicator error:", error);
  }

  static subscribeToTyping(conversationId: string, userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`typing-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_indicators",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          if (payload.new?.user_id !== userId) {
            callback(payload);
          }
        }
      )
      .subscribe();
  }
}