import { createClient } from "@/lib/supabase/client";

// update score for a specific volunteer in the database
export async function updateVolunteerScore(id: string, score: number | null) {
  const supabase = createClient();
  console.log('updateVolunteerScore called', { id, score });

  const { data, error } = await supabase.from('volunteer').update({ score }).eq('volunteer_id', id);

  // throw error if the update fails
  if (error) {
    console.error('updateVolunteerScore failed', { id, score, error });
    throw error;
  }

  // log success
  console.log('updateVolunteerScore succeeded', { id, score, updated: !!data });
  return;
}
