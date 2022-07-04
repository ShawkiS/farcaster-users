import { createClient } from '@supabase/supabase-js'

export const getSupabaseClient = () => { 
    const supabase = createClient('https://srglffokactjkdfmdpdo.supabase.co', process.env.SUPABASEKEY)
    return supabase;
}

export const getAllSupabaseUsers = async () => {
    const client = await getSupabaseClient();

    const { data } = await client
     .from('users')
    .select();

    return data;
}
