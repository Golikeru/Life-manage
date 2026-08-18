import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { CategoryManager } from "@/components/settings/category-manager";
import { AccountSection } from "@/components/settings/account-section";
import { categoryBreakdown } from "@/lib/stats";
import type { Category, Task } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: categories }, { data: tasks }] = await Promise.all([
    supabase.from("categories").select("*").eq("user_id", user!.id).order("sort_order"),
    supabase.from("tasks").select("*").eq("user_id", user!.id),
  ]);

  const stats = categoryBreakdown((tasks as Task[]) ?? [], (categories as Category[]) ?? []);
  const statsMap = new Map(stats.map((s) => [s.id, s]));

  return (
    <div>
      <PageHeader title="設定" description="カテゴリとアカウントを管理します" />

      <div className="flex flex-col gap-6">
        <AccountSection email={user!.email ?? ""} createdAt={user!.created_at} />
        <CategoryManager categories={(categories as Category[]) ?? []} statsMap={Object.fromEntries(statsMap)} />
      </div>
    </div>
  );
}
