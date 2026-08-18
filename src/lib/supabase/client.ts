import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";

/**
 * クライアントコンポーネント（ブラウザ）から使うSupabaseクライアント。
 * "use client" 配下のコンポーネントで呼び出してください。
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
