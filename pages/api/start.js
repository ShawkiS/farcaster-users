import { syncUsersSearchIndex } from "../../services/algolia";
import { getSupabaseClient } from "../../services/supabase"
import { getAllUsers } from "../../services/farcaster"

export default async function handler(req, res) {
  const dbClient = await getSupabaseClient();

  const users = await getAllUsers();

    const { data, error } = await dbClient
    .from('users')
    .insert(users);

    await syncUsersSearchIndex(users);

  res.status(200).json({ users: users })
}
