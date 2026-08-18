import { addDays, format, startOfWeek } from "date-fns";
import type { Habit, HabitRecord } from "@/lib/types";

/** habit_records から日付(YYYY-MM-DD) -> completed のMapを作る */
export function toRecordMap(records: HabitRecord[]): Map<string, boolean> {
  const map = new Map<string, boolean>();
  for (const r of records) {
    map.set(r.date, r.completed);
  }
  return map;
}

/**
 * 現在のストリーク（連続達成日数/週数）を計算する。
 * - daily: 今日 or 昨日を起点に、連続して達成日が続く日数
 * - weekly: 今週 or 先週を起点に、target_count以上達成した週が連続して続く週数
 */
export function calculateStreak(habit: Habit, records: HabitRecord[]): number {
  const recordMap = toRecordMap(records);
  const today = new Date();

  if (habit.frequency === "daily") {
    let streak = 0;
    let cursor = today;

    // 今日がまだ未達成なら、昨日から数え始める（今日はまだチャンスが残っているため）
    if (!recordMap.get(format(today, "yyyy-MM-dd"))) {
      cursor = addDays(today, -1);
    }

    while (recordMap.get(format(cursor, "yyyy-MM-dd"))) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  // weekly
  let streak = 0;
  let weekStart = startOfWeek(today, { weekStartsOn: 1 });

  const countInWeek = (start: Date) => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = format(addDays(start, i), "yyyy-MM-dd");
      if (recordMap.get(d)) count += 1;
    }
    return count;
  };

  // 今週がまだ目標未達なら先週から数え始める
  if (countInWeek(weekStart) < habit.target_count) {
    weekStart = addDays(weekStart, -7);
  }

  while (countInWeek(weekStart) >= habit.target_count) {
    streak += 1;
    weekStart = addDays(weekStart, -7);
  }

  return streak;
}

export function countThisWeek(records: HabitRecord[]): number {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const recordMap = toRecordMap(records);
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = format(addDays(weekStart, i), "yyyy-MM-dd");
    if (recordMap.get(d)) count += 1;
  }
  return count;
}

/** 直近N日分の日付配列(古い順)を生成 */
export function lastNDays(n: number): string[] {
  const today = new Date();
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(format(addDays(today, -i), "yyyy-MM-dd"));
  }
  return days;
}
