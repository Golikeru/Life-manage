import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { HabitsView } from "@/components/habits/habits-view";
import { lastNDays } from "@/lib/habit-utils";
import type { Habit, HabitRecord } from "@/lib/types";

export default async function HabitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const days = lastNDays(84);
  const fromDate = days[0];

  const [{ data: habits }, { data: records }] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", user!.id)
      .eq("archived", false)
      .order("created_at", { ascending: true }),
    supabase
      .from("habit_records")
      .select("*")
      .eq("user_id", user!.id)
      .gte("date", fromDate),
  ]);

  return (
    <div>
      <PageHeader title="習慣" description="小さな積み重ねが、大きな成長になる" />
      <HabitsView habits={(habits as Habit[]) ?? []} records={(records as HabitRecord[]) ?? []} />
    </div>
  );
}
