import { s as supabase, i as cn } from "./router-C7G81YgB.js";
import { U as reactExports, L as jsxRuntimeExports } from "./server-DJBFbZXq.js";
import { a as createSlot, b as cva, c as createLucideIcon } from "./createLucideIcon-DYOIArt-.js";
class AuthService {
  /**
   * Sign in with username instead of email.
   * Looks up the email associated with the username, then signs in with that email.
   */
  static async signInWithUsername({ username, password }) {
    const { data: profile, error: lookupError } = await supabase.from("profiles").select("email, id, full_name").eq("username", username).maybeSingle();
    if (lookupError || !profile?.email) {
      throw new Error("Usuário não encontrado. Verifique o nome de usuário.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password
    });
    if (error) throw error;
    return data;
  }
  /**
   * Check if username is available
   */
  static async checkUsername(username) {
    const { data, error } = await supabase.from("profiles").select("id").eq("username", username).maybeSingle();
    if (error) throw error;
    return !data;
  }
  /**
   * Sign up with username
   */
  static async signUp(data) {
    const available = await this.checkUsername(data.username);
    if (!available) {
      throw new Error("Nome de usuário já está em uso.");
    }
    const tempEmail = `${data.username}@hub-in.internal`;
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: tempEmail,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          username: data.username
        }
      }
    });
    if (signUpError) throw signUpError;
    if (authData.user) {
      const { error: updateError } = await supabase.from("profiles").update({
        full_name: data.full_name,
        username: data.username,
        email: tempEmail
      }).eq("id", authData.user.id);
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
  static async resetPassword(username) {
    const { data: profile, error: lookupError } = await supabase.from("profiles").select("email").eq("username", username).maybeSingle();
    if (lookupError || !profile?.email) {
      throw new Error("Usuário não encontrado.");
    }
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
    if (error) throw error;
  }
  /**
   * Update password
   */
  static async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }
  /**
   * Get all users in company
   */
  static async getUsers(companyId) {
    const { data, error } = await supabase.from("profiles").select(`
        *,
        user_roles!inner(role, company_id),
        sectors!left(name, color)
      `).eq("company_id", companyId).order("full_name");
    if (error) throw error;
    return data;
  }
  /**
   * Update user role
   */
  static async updateUserRole(userId, role, companyId) {
    await supabase.from("user_roles").delete().eq("user_id", userId).eq("company_id", companyId);
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role,
      company_id: companyId
    });
    if (error) throw error;
  }
  /**
   * Update user profile
   */
  static async updateProfile(userId, updates) {
    const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
    if (error) throw error;
  }
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[/* @__PURE__ */ Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        props.onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
export {
  AuthService as A,
  Label as L,
  ShieldCheck as S
};
