import { s as supabase } from "./router-C7G81YgB.js";
class SectorsService {
  static async getAll(companyId) {
    const { data, error } = await supabase.from("sectors").select("*").eq("company_id", companyId).order("name");
    if (error) throw error;
    return data || [];
  }
  static async create(data) {
    const { data: result, error } = await supabase.from("sectors").insert(data).select().single();
    if (error) throw error;
    return result;
  }
  static async update(id, updates) {
    const { error } = await supabase.from("sectors").update(updates).eq("id", id);
    if (error) throw error;
  }
  static async delete(id) {
    const { error } = await supabase.from("sectors").delete().eq("id", id);
    if (error) throw error;
  }
}
export {
  SectorsService as S
};
