import { supabase } from "@/integrations/supabase/client";
import type { NotificationItem } from "@/lib/types";

export class NotificationsService {
  static async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return (data || []) as NotificationItem[];
  }

  static async createNotification(data: {
    user_id: string;
    type: string;
    title: string;
    body?: string;
    link?: string;
  }) {
    const { error } = await supabase
      .from("notifications")
      .insert(data as any);

    if (error) console.error("Failed to create notification:", error);
  }

  static async markAsRead(id: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
    if (error) throw error;
  }

  static async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
    if (error) throw error;
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) return 0;
    return count || 0;
  }

  static subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }
}