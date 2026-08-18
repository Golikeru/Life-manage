import {
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
  isWithinInterval,
} from "date-fns";
import { ja } from "date-fns/locale";
import type { Category, HabitRecord, Task } from "@/lib/types";

function pct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function todaysOverview(tasks: Task[]) {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaysTasks = tasks.filter((t) => t.deadline === todayStr);
  const completed = todaysTasks.filter((t) => t.status === "done").length;
  return {
    total: todaysTasks.length,
    completed,
    rate: pct(completed, todaysTasks.length),
  };
}

export function totalCompleted(tasks: Task[]) {
  return tasks.filter((t) => t.status === "done").length;
}

export function thisWeekRate(tasks: Task[]) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const inWeek = tasks.filter(
    (t) => t.deadline && isWithinInterval(parseISO(t.deadline), { start: weekStart, end: weekEnd })
  );
  const completed = inWeek.filter((t) => t.status === "done").length;
  return { total: inWeek.length, completed, rate: pct(completed, inWeek.length) };
}

/** タスク完了 or 習慣達成のあった日を起点に連続達成日数を計算 */
export function calculateGrowthStreak(tasks: Task[], habitRecords: HabitRecord[]): number {
  const activeDays = new Set<string>();
  for (const t of tasks) {
    if (t.completed_at) activeDays.add(t.completed_at.slice(0, 10));
  }
  for (const r of habitRecords) {
    if (r.completed) activeDays.add(r.date);
  }

  const today = new Date();
  let cursor = today;
  if (!activeDays.has(format(today, "yyyy-MM-dd"))) {
    cursor = addDays(today, -1);
  }

  let streak = 0;
  while (activeDays.has(format(cursor, "yyyy-MM-dd"))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface CategoryStat {
  id: string;
  name: string;
  color: string;
  total: number;
  completed: number;
  rate: number;
}

export function categoryBreakdown(tasks: Task[], categories: Category[]): CategoryStat[] {
  return categories
    .map((c) => {
      const inCategory = tasks.filter((t) => t.category_id === c.id);
      const completed = inCategory.filter((t) => t.status === "done").length;
      return {
        id: c.id,
        name: c.name,
        color: c.color,
        total: inCategory.length,
        completed,
        rate: pct(completed, inCategory.length),
      };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}

export interface TrendPoint {
  label: string;
  total: number;
  completed: number;
  rate: number;
}

/** 直近N週間の達成推移（期限日ベース） */
export function weeklyTrend(tasks: Task[], weeks = 8): TrendPoint[] {
  const points: TrendPoint[] = [];
  const now = new Date();

  for (let i = weeks - 1; i >= 0; i--) {
    const weekAnchor = addWeeks(now, -i);
    const start = startOfWeek(weekAnchor, { weekStartsOn: 1 });
    const end = endOfWeek(weekAnchor, { weekStartsOn: 1 });
    const inWeek = tasks.filter(
      (t) => t.deadline && isWithinInterval(parseISO(t.deadline), { start, end })
    );
    const completed = inWeek.filter((t) => t.status === "done").length;
    points.push({
      label: format(start, "M/d", { locale: ja }),
      total: inWeek.length,
      completed,
      rate: pct(completed, inWeek.length),
    });
  }
  return points;
}

/** 直近Nヶ月の達成推移（期限日ベース） */
export function monthlyTrend(tasks: Task[], months = 6): TrendPoint[] {
  const points: TrendPoint[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthAnchor = addMonths(now, -i);
    const start = startOfMonth(monthAnchor);
    const end = endOfMonth(monthAnchor);
    const inMonth = tasks.filter(
      (t) => t.deadline && isWithinInterval(parseISO(t.deadline), { start, end })
    );
    const completed = inMonth.filter((t) => t.status === "done").length;
    points.push({
      label: format(start, "M月", { locale: ja }),
      total: inMonth.length,
      completed,
      rate: pct(completed, inMonth.length),
    });
  }
  return points;
}
