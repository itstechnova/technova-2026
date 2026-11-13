"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/dal";

export async function updateUserAcceptanceStatus(userId: string, accepted: boolean) {
  await requireRole(["admin"]);
  if (!userId || typeof accepted !== "boolean") {
    return { success: false as const, error: "Invalid acceptance update." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("user")
    .update({ accepted }).eq("user_id", userId)
    .select("user_id, accepted").single();
  if (error || !data) {
    return { success: false as const, error: "Acceptance status could not be saved. Please try again." };
  }
  return { success: true as const };
}
