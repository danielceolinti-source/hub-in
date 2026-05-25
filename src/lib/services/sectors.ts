import { supabase } from "@/integrations/supabase/client";

export class SectorsService {
  static async getAll(companyId: string) {
    const { data, error } = await supabase
      .from("sectors")
      .select("*")
      .eq("company_id", companyId)
      .order("name");

    if (error) throw error;
    return data || [];
  }

  static async create(data: { company_id: string; name: string; slug: string; color?: string }) {
    const { data: result, error } = await supabase
      .from("sectors")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async update(id: string, updates: { name?: string; color?: string }) {
    const { error } = await supabase
      .from("sectors")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from("sectors")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}