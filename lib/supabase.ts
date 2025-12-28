
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// In this environment, we check process.env directly. 
// If they are missing, we provide null so the app can detect and fallback to mock data.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 0;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
