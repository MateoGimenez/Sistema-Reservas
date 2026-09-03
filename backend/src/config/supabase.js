import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL o Key mal configurados.");
} else {
  console.log("Supabase URL y Key configurados correctamente.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;