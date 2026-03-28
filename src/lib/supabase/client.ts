import { createBrowserClient } from '@supabase/ssr'

export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!url && url !== 'YOUR_SUPABASE_URL' && !!key && key !== 'YOUR_SUPABASE_ANON_KEY';
};

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!isSupabaseConfigured()) {
    console.warn('Supabase credentials missing. Client will use dummy values and may fail to fetch.');
    const dummyUrl = 'https://dummy.supabase.co';
    const dummyKey = 'dummy-key';
    return createBrowserClient(dummyUrl, dummyKey);
  }

  return createBrowserClient(url!, key!)
}

export const supabase = createClient();
