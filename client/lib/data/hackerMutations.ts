import { createClient } from "@/lib/supabase/client";

// update score for a specific hacker in the database
export async function updateHackerScore(id: string, score: number | null) {
  const supabase = createClient();
  console.log('updateHackerScore called', { id, score });

  const { data, error } = await supabase.from('hacker').update({ score }).eq('hacker_id', id);

  // throw error if the update fails
  if (error) {
    console.error('updateHackerScore failed', { id, score, error });
    throw error;
  }

  // log success
  console.log('updateHackerScore succeeded', { id, score, updated: !!data });
  return;
}
