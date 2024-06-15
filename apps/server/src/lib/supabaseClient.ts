import * as dotenv from "dotenv";

dotenv.config();
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

console.log(supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
