import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { CalendarView } from "@/components/calendar/calendar-view";
import { format, subDays } from "date-fns";
import type { Category, Habit, HabitRecord, Task } from "@/lib/types";

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const historyFrom = format(subDays(new Date(), 400), "yyyy-MM-dd");

  const [{ data: tasks }, { data: categories }, { data: habits }, { data: habitRecords }] = await Promise.all([
    supabase.from("tasks").select("*").eq("user_id", user!.id),
    supabase.from("categories").select("*").eq("user_id", user!.id).order("sort_order"),
    supabase.from("habits").select("*").eq("user_id", user!.id).eq("archived", false),
    supabase.from("habit_records").select("*").eq("user_id", user!.id).gte("date", historyFrom),
  ]);

  return (
    <div>
      <PageHeader title="カレンダー" description="期限・完了・習慣達成をまとめて確認" />
      <CalendarView
        tasks={(tasks as Task[]) ?? []}
        categories={(categories as Category[]) ?? []}
        habits={(habits as Habit[]) ?? []}
        habitRecords={(habitRecords as HabitRecord[]) ?? []}
      />
    </div>
  );
}
