import { createClient } from "@/lib/supabase/client";

export type UserAcceptanceUpdateResult = {
  user_id: string;
  accepted: boolean | null;
};

export async function updateUserAcceptanceStatus(userId: string, accepted: boolean) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user")
    .update({ accepted })
    .eq("user_id", userId)
    .select("user_id, accepted")
    .single<UserAcceptanceUpdateResult>();

  if (error) {
    console.error("updateUserAcceptanceStatus failed", { userId, accepted, error });
    throw new Error(error.message || "Failed to update user acceptance status.");
  }

  return data;
}
