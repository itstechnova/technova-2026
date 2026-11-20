"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/dal";

export async function updateVolunteerScore(id: string, score: number | null) {
  await requireRole(["admin"]);
  if (!id || (score !== null && (!Number.isInteger(score) || score < 1 || score > 10))) {
    return { success: false as const, error: "Choose a score between 1 and 10." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("volunteer")
    .update({ score }).eq("volunteer_id", id).select("volunteer_id").single();
  if (error || !data) {
    return { success: false as const, error: "Score could not be saved. Please try again." };
  }
  return { success: true as const };
}
