import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',  // Replace with your Supabase URL
  'YOUR_SUPABASE_ANON_KEY'  // Replace with your Supabase anonymous key
);

export default supabase;
