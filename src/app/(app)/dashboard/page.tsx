import { CheckCircle2, ListTodo, Flame, Trophy, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  todaysOverview,
  totalCompleted,
  thisWeekRate,
  calculateGrowthStreak,
  categoryBreakdown,
  weeklyTrend,
  monthlyTrend,
} from "@/lib/stats";
import type { Category, HabitRecord, Task } from "@/lib/types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sixMonthsAgoStr = format(new Date(new Date().setMonth(new Date().getMonth() - 6)), "yyyy-MM-dd");

  const [{ data: tasksData }, { data: categoriesData }, { data: habitRecordsData }] = await Promise.all([
    supabase.from("tasks").select("*").eq("user_id", user!.id),
    supabase.from("categories").select("*").eq("user_id", user!.id).order("sort_order"),
    supabase.from("habit_records").select("*").eq("user_id", user!.id).gte("date", sixMonthsAgoStr),
  ]);

  const tasks = (tasksData as Task[]) ?? [];
  const categories = (categoriesData as Category[]) ?? [];
  const habitRecords = (habitRecordsData as HabitRecord[]) ?? [];

  const today = todaysOverview(tasks);
  const completedTotal = totalCompleted(tasks);
  const week = thisWeekRate(tasks);
  const streak = calculateGrowthStreak(tasks, habitRecords);
  const categoryStats = categoryBreakdown(tasks, categories);
  const weekly = weeklyTrend(tasks, 8);
  const monthly = monthlyTrend(tasks, 6);

  const todayLabel = format(new Date(), "M月d日(E)", { locale: ja });

  return (
    <div>
      <PageHeader title="ダッシュボード" description={`${todayLabel} の状況`} />

      {/* 今日の概要 */}
      <section className="mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">今日の達成率</p>
              <p className="text-sm font-semibold text-primary">{today.rate}%</p>
            </div>
            <Progress value={today.rate} className="h-2.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              今日期限のタスク {today.completed}/{today.total} 件完了
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3">
        <StatCard icon={ListTodo} label="今日のタスク数" value={today.total} suffix="件" />
        <StatCard
          icon={CheckCircle2}
          label="今日の完了数"
          value={today.completed}
          suffix="件"
          accentClass="bg-success/10 text-success"
        />
      </section>

      {/* 成長状況 */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">成長状況</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Flame} label="連続達成日数" value={streak} suffix="日" accentClass="bg-warning/10 text-warning" />
          <StatCard icon={Trophy} label="総完了タスク" value={completedTotal} suffix="件" />
          <StatCard
            icon={TrendingUp}
            label="今週の達成率"
            value={week.rate}
            suffix="%"
            accentClass="bg-success/10 text-success"
          />
        </div>
      </section>

      {/* 分析 */}
      <section className="mb-6 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground">分析</h2>
        <CategoryChart data={categoryStats} />
        <TrendChart title="週間達成推移" data={weekly} />
        <TrendChart title="月間達成推移" data={monthly} />
      </section>
    </div>
  );
}
