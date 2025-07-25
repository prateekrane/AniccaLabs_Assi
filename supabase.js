import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and anon key
const supabaseUrl = 'https://ibuxeiifrotxfnjxjtwc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidXhlaWlmcm90eGZuanhqdHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzg1MDIsImV4cCI6MjA2ODk1NDUwMn0.rP0oi2a-6RdAX0Iga-R7LgDFev1LfqnKF2B9gOGVom0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
