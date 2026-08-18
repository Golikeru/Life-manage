import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // middlewareでも保護しているが、念のためサーバーコンポーネント側でも確認する
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6 sm:max-w-2xl sm:px-6">{children}</div>
      <BottomNav />
    </div>
  );
}
