import { supabase } from "@/integrations/supabase/client";
import type { AuthCredentials, SignupData } from "@/lib/types";

export class AuthService {
  /**
   * Sign in with username instead of email.
   * Looks up the email associated with the username, then signs in with that email.
   */
  static async signInWithUsername({ username, password }: AuthCredentials) {
    // Try to get email from profiles by username
    const { data: profile, error: lookupError } = await supabase
      .from("profiles")
      .select("email, id, full_name")
      .eq("username", username)
      .maybeSingle();

    if (lookupError || !profile?.email) {
      throw new Error("Usuário não encontrado. Verifique o nome de usuário.");
    }

    // Sign in with the email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Check if username is available
   */
  static async checkUsername(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    if (error) throw error;
    return !data;
  }

  /**
   * Sign up with username
   */
  static async signUp(data: SignupData) {
    // First check if username exists
    const available = await this.checkUsername(data.username);
    if (!available) {
      throw new Error("Nome de usuário já está em uso.");
    }

    // Create a temporary email based on username for Supabase Auth
    const tempEmail = `${data.username}@hub-in.internal`;

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: tempEmail,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          username: data.username,
        },
      },
    });

    if (signUpError) throw signUpError;

    // Update the profile with the correct username and full_name
    if (authData.user) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          username: data.username,
          email: tempEmail,
        })
        .eq("id", authData.user.id);

      if (updateError) throw updateError;
    }

    return authData;
  }

  /**
   * Sign out
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Reset password
   */
  static async resetPassword(username: string) {
    const { data: profile, error: lookupError } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", username)
      .maybeSingle();

    if (lookupError || !profile?.email) {
      throw new Error("Usuário não encontrado.");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
    if (error) throw error;
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }

  /**
   * Get all users in company
   */
  static async getUsers(companyId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        user_roles!inner(role, company_id),
        sectors!left(name, color)
      `)
      .eq("company_id", companyId)
      .order("full_name");

    if (error) throw error;
    return data;
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, role: string, companyId: string) {
    // Delete existing roles
    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("company_id", companyId);

    // Insert new role
    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: role as any,
        company_id: companyId,
      });

    if (error) throw error;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Record<string, any>) {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);
    if (error) throw error;
  }
}