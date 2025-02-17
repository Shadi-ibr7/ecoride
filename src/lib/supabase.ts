
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xjhfkwimlaeomsjvqofv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaGZrd2ltbGFlb21zanZxb2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYxODMsImV4cCI6MjA1MDQ3MjE4M30.-NjIpScbND0LxYZfndt9KJULjL8Jx_8JuuAIvjdeEXg";

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
