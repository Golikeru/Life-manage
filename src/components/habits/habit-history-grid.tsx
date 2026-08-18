"use client";

import { lastNDays } from "@/lib/habit-utils";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

export function HabitHistoryGrid({
  recordDates,
  color,
  days = 35,
}: {
  recordDates: Set<string>;
  color: string;
  days?: number;
}) {
  const dateList = lastNDays(days);

  return (
    <div className="flex flex-wrap gap-1.5" title="直近の達成履歴">
      {dateList.map((d) => {
        const achieved = recordDates.has(d);
        return (
          <div
            key={d}
            className={cn("h-3.5 w-3.5 rounded-[4px] border border-black/[0.03]")}
            style={{ backgroundColor: achieved ? color : "hsl(var(--muted))" }}
            aria-label={`${format(parseISO(d), "M月d日(E)", { locale: ja })}: ${achieved ? "達成" : "未達成"}`}
          />
        );
      })}
    </div>
  );
}
