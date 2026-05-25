import { supabase } from "@/integrations/supabase/client";
import type { ConversationWithDetails } from "@/lib/types";

export class ConversationsService {
  static async getConversations(params: {
    companyId: string;
    status?: string;
    assignedTo?: string;
    sectorId?: string;
    search?: string;
    favorite?: boolean;
  }) {
    let query = supabase
      .from("conversations")
      .select(`
        *,
        sectors(name, color),
        assigned:profiles!conversations_assigned_to_fkey(full_name)
      `)
      .eq("company_id", params.companyId)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (params.status && params.status !== "all") {
      if (params.status === "unread") {
        query = query.gt("unread_count", 0);
      } else if (params.status === "pinned") {
        query = query.eq("is_favorite", true);
      } else {
        query = query.eq("status", params.status);
      }
    }

    if (params.assignedTo) {
      query = query.eq("assigned_to", params.assignedTo);
    }

    if (params.sectorId) {
      query = query.eq("sector_id", params.sectorId);
    }

    if (params.favorite) {
      query = query.eq("is_favorite", true);
    }

    if (params.search) {
      query = query.or(`contact_name.ilike.%${params.search}%,contact_phone.ilike.%${params.search}%,last_message_preview.ilike.%${params.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((c: any) => ({
      ...c,
      sector_name: c.sectors?.name || null,
      sector_color: c.sectors?.color || null,
      assigned_name: c.assigned?.full_name || null,
      tags: [],
    })) as ConversationWithDetails[];
  }

  static async getConversation(id: string) {
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        *,
        sectors(name, color),
        assigned:profiles!conversations_assigned_to_fkey(full_name, avatar_url),
        conversation_tags(
          tags(id, name, color)
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    const conv = data as any;
    return {
      ...conv,
      sector_name: conv.sectors?.name || null,
      sector_color: conv.sectors?.color || null,
      assigned_name: conv.assigned?.full_name || null,
      tags: conv.conversation_tags?.map((ct: any) => ct.tags) || [],
    } as ConversationWithDetails;
  }

  static async createConversation(data: {
    company_id: string;
    contact_name: string;
    contact_phone: string;
    sector_id?: string;
    assigned_to?: string;
    channel?: string;
  }) {
    const { data: result, error } = await supabase
      .from("conversations")
      .insert({
        company_id: data.company_id,
        contact_name: data.contact_name,
        contact_phone: data.contact_phone,
        sector_id: data.sector_id,
        assigned_to: data.assigned_to,
        channel: data.channel || "whatsapp",
        status: "open",
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async updateConversation(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async assignConversation(id: string, userId: string | null) {
    return this.updateConversation(id, { assigned_to: userId });
  }

  static async toggleFavorite(id: string, isFavorite: boolean) {
    return this.updateConversation(id, { is_favorite: !isFavorite });
  }

  static async updateStatus(id: string, status: string) {
    return this.updateConversation(id, { status });
  }

  static async markAsRead(id: string) {
    return this.updateConversation(id, { unread_count: 0 });
  }

  static async deleteConversation(id: string) {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }

  static subscribeToConversations(companyId: string, callback: (payload: any) => void) {
    return supabase
      .channel("conversations-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `company_id=eq.${companyId}`,
        },
        callback
      )
      .subscribe();
  }
}