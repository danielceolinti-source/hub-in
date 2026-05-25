import { s as supabase } from "./router-C7G81YgB.js";
class DashboardService {
  static async getStats(companyId) {
    const now = /* @__PURE__ */ new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
    const { count: activeConversations } = await supabase.from("conversations").select("*", { count: "exact", head: true }).eq("company_id", companyId).in("status", ["open", "pending"]);
    const { count: totalConversations } = await supabase.from("conversations").select("*", { count: "exact", head: true }).eq("company_id", companyId);
    const { count: resolvedToday } = await supabase.from("conversations").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "resolved").gte("updated_at", yesterday.toISOString());
    const { count: agentsOnline } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("presence", "online");
    const { count: totalAgents } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("company_id", companyId);
    const { data: sectors } = await supabase.from("sectors").select("id, name, color").eq("company_id", companyId);
    const bySector = [];
    if (sectors) {
      for (const sector of sectors) {
        const { count } = await supabase.from("conversations").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("sector_id", sector.id);
        bySector.push({ name: sector.name, value: count || 0 });
      }
    }
    const { data: agents } = await supabase.from("profiles").select("id, full_name, sector_id").eq("company_id", companyId).limit(10);
    const topAgents = [];
    if (agents) {
      for (const agent of agents) {
        const { count } = await supabase.from("conversations").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("assigned_to", agent.id);
        const sectorName = sectors?.find((s) => s.id === agent.sector_id)?.name || "-";
        topAgents.push({
          id: agent.id,
          name: agent.full_name,
          sector: sectorName,
          conversations: count || 0,
          avg_time: "—"
        });
      }
      topAgents.sort((a, b) => b.conversations - a.conversations);
    }
    const volume24h = [];
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1e3);
      const hourStr = `${String(hour.getHours()).padStart(2, "0")}h`;
      const startOfHour = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours(), 0, 0).toISOString();
      const endOfHour = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours(), 59, 59).toISOString();
      const { count: inbound } = await supabase.from("messages").select("*", { count: "exact", head: true }).eq("direction", "inbound").gte("created_at", startOfHour).lte("created_at", endOfHour);
      const { count: outbound } = await supabase.from("messages").select("*", { count: "exact", head: true }).eq("direction", "outbound").gte("created_at", startOfHour).lte("created_at", endOfHour);
      volume24h.push({ hour: hourStr, inbound: inbound || 0, outbound: outbound || 0 });
    }
    const slaData = (sectors || []).map((s) => ({
      label: s.name,
      value: Math.round(60 + Math.random() * 35),
      // Simulated SLA for now
      color: s.color || "#3b82f6"
    }));
    const resolutionRate = totalConversations && totalConversations > 0 ? Math.round((resolvedToday || 0) / totalConversations * 100 * 10) / 10 : 0;
    return {
      active_conversations: activeConversations || 0,
      avg_response_time: 0,
      // Will be calculated from message timestamps
      agents_online: agentsOnline || 0,
      total_agents: totalAgents || 0,
      resolution_rate: resolutionRate,
      volume_24h: volume24h,
      by_sector: bySector,
      top_agents: topAgents.slice(0, 5),
      sla_data: slaData
    };
  }
}
export {
  DashboardService as D
};
