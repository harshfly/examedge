import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const finalUrl = url && url !== 'YOUR_SUPABASE_URL' ? url : 'https://dummy.supabase.co';
  const finalKey = key && key !== 'YOUR_SUPABASE_ANON_KEY' ? key : 'dummy-key';

  return createBrowserClient(finalUrl, finalKey)
}

export const supabase = createClient();
