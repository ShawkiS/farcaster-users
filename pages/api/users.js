import { getAllSupabaseUsers } from "../../services/supabase"

export default async function handler(req, res) {
  const users = await getAllSupabaseUsers();
  res.status(200).json({ users: users })
}
