// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xfrviotvcjsshkxxzwzs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmcnZpb3R2Y2pzc2hreHh6d3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNzQ5ODQsImV4cCI6MjA2Njc1MDk4NH0.rSO65BfOA_NtIqHPfyeXzdUsH_-aHlxVpcAsPddU5lk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);