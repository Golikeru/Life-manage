import type { Priority, HabitFrequency } from "@/lib/types";

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; badgeClass: string; dotClass: string; order: number }
> = {
  high: {
    label: "High",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
    dotClass: "bg-destructive",
    order: 0,
  },
  medium: {
    label: "Medium",
    badgeClass: "bg-warning/10 text-warning border-warning/20",
    dotClass: "bg-warning",
    order: 1,
  },
  low: {
    label: "Low",
    badgeClass: "bg-muted text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
    order: 2,
  },
};

export const FREQUENCY_LABEL: Record<HabitFrequency, string> = {
  daily: "毎日",
  weekly: "毎週",
};

export const DEFAULT_CATEGORY_COLORS = [
  "#0A84FF",
  "#5E5CE6",
  "#30B0C7",
  "#FF9F0A",
  "#34C759",
  "#FF375F",
  "#8E8E93",
  "#BF5AF2",
  "#FF453A",
  "#64D2FF",
];

export type DeadlineFilter = "all" | "today" | "tomorrow" | "this_week" | "no_deadline" | "overdue";

export const DEADLINE_FILTER_LABEL: Record<DeadlineFilter, string> = {
  all: "すべて",
  overdue: "期限切れ",
  today: "今日まで",
  tomorrow: "明日まで",
  this_week: "今週まで",
  no_deadline: "期限なし",
};

export type SortKey = "deadline" | "priority" | "created_at" | "title";

export const SORT_LABEL: Record<SortKey, string> = {
  deadline: "期限順",
  priority: "優先度順",
  created_at: "作成日順",
  title: "タイトル順",
};
