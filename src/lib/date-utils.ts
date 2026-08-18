import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  addDays,
  isBefore,
  isAfter,
  isSameDay,
  parseISO,
  format,
} from "date-fns";
import { ja } from "date-fns/locale";
import type { DeadlineFilter } from "@/lib/constants";

/** DBに保存する "YYYY-MM-DD" 形式の今日の日付文字列 */
export function todayStr(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function toDate(dateStr: string): Date {
  return parseISO(dateStr);
}

export function formatDate(dateStr: string, fmt = "M月d日(E)"): string {
  return format(parseISO(dateStr), fmt, { locale: ja });
}

/** 期限文字列(YYYY-MM-DD)が指定したフィルタ条件に一致するか判定 */
export function matchesDeadlineFilter(
  deadline: string | null,
  status: string,
  filter: DeadlineFilter
): boolean {
  if (filter === "all") return true;
  if (filter === "no_deadline") return !deadline;
  if (!deadline) return false;

  const d = parseISO(deadline);
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  switch (filter) {
    case "overdue":
      return status !== "done" && isBefore(d, todayStart);
    case "today":
      return d >= todayStart && d <= todayEnd;
    case "tomorrow": {
      const tomorrow = addDays(now, 1);
      return isSameDay(d, tomorrow) || (d >= todayStart && d <= endOfDay(tomorrow));
    }
    case "this_week": {
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      return d >= weekStart && d <= weekEnd;
    }
    default:
      return true;
  }
}

export function isOverdue(deadline: string | null, status: string): boolean {
  if (!deadline || status === "done") return false;
  return isBefore(parseISO(deadline), startOfDay(new Date()));
}

export function isDueToday(deadline: string | null): boolean {
  if (!deadline) return false;
  return isSameDay(parseISO(deadline), new Date());
}

export { isBefore, isAfter, isSameDay, startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, format, parseISO };
