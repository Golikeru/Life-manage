import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { TasksView } from "@/components/tasks/tasks-view";
import type { Category, Task } from "@/lib/types";

export default async function TasksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: tasks }, { data: categories }] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .eq("user_id", user!.id)
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <div>
      <PageHeader title="タスク" description="やるべきことを整理して、一歩ずつ前進しよう" />
      <TasksView tasks={(tasks as Task[]) ?? []} categories={(categories as Category[]) ?? []} />
    </div>
  );
}
