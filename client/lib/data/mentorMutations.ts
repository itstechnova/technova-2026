import { createClient } from "@/lib/supabase/client";

// update score for a specific mentor in the database
export async function updateMentorScore(id: string, score: number | null) {
  const supabase = createClient();
  console.log('updateMentorScore called', { id, score });

  const { data, error } = await supabase.from('mentor').update({ score }).eq('mentor_id', id);

  // throw error if the update fails
  if (error) {
    console.error('updateMentorScore failed', { id, score, error });
    throw error;
  }

  // log success
  console.log('updateMentorScore succeeded', { id, score, updated: !!data });
  return;
}
