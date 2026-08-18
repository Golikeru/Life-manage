"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CheckCircle2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { CategoryBadge } from "@/components/shared/category-badge";
import { cn } from "@/lib/utils";
import type { Category, Habit, HabitRecord, Task } from "@/lib/types";

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];

export function CalendarView({
  tasks,
  categories,
  habits,
  habitRecords,
}: {
  tasks: Task[];
  categories: Category[];
  habits: Habit[];
  habitRecords: HabitRecord[];
}) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const habitMap = useMemo(() => new Map(habits.map((h) => [h.id, h])), [habits]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const dayInfo = useMemo(() => {
    const map = new Map<
      string,
      { due: Task[]; completed: Task[]; habitDates: HabitRecord[] }
    >();
    for (const d of days) {
      map.set(format(d, "yyyy-MM-dd"), { due: [], completed: [], habitDates: [] });
    }
    for (const t of tasks) {
      if (t.deadline && map.has(t.deadline)) map.get(t.deadline)!.due.push(t);
      if (t.completed_at) {
        const key = t.completed_at.slice(0, 10);
        if (map.has(key)) map.get(key)!.completed.push(t);
      }
    }
    for (const r of habitRecords) {
      if (r.completed && map.has(r.date)) map.get(r.date)!.habitDates.push(r);
    }
    return map;
  }, [days, tasks, habitRecords]);

  const selected = dayInfo.get(selectedDay);

  return (
    <div>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setMonth((m) => addMonths(m, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <p className="text-sm font-semibold">{format(month, "yyyy年 M月", { locale: ja })}</p>
            <Button variant="ghost" size="icon" onClick={() => setMonth((m) => addMonths(m, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const key = format(d, "yyyy-MM-dd");
              const info = dayInfo.get(key);
              const inMonth = isSameMonth(d, month);
              const active = key === selectedDay;
              const hasDue = (info?.due.length ?? 0) > 0;
              const hasCompleted = (info?.completed.length ?? 0) > 0;
              const habitDots = (info?.habitDates ?? []).slice(0, 3);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-start gap-1 rounded-xl py-1.5 text-xs transition-colors",
                    !inMonth && "opacity-30",
                    active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full",
                      isToday(d) && !active && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    {format(d, "d")}
                  </span>
                  <div className="flex h-3 items-center gap-0.5">
                    {hasDue && (
                      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-primary-foreground" : "bg-primary")} />
                    )}
                    {hasCompleted && (
                      <CheckCircle2 className={cn("h-2.5 w-2.5", active ? "text-primary-foreground" : "text-success")} />
                    )}
                    {habitDots.map((r) => (
                      <span
                        key={r.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: active ? "currentColor" : habitMap.get(r.habit_id)?.color ?? "#999" }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">
          {format(new Date(selectedDay), "M月d日(E)", { locale: ja })} の記録
        </p>

        {selected && selected.due.length === 0 && selected.completed.length === 0 && selected.habitDates.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            この日の記録はありません
          </p>
        ) : (
          <>
            {selected?.due.map((t) => (
              <Card key={t.id}>
                <CardContent className="flex items-center justify-between gap-2 p-3.5">
                  <div className="min-w-0">
                    <p className={cn("truncate text-sm font-medium", t.status === "done" && "text-muted-foreground line-through")}>
                      {t.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <PriorityBadge priority={t.priority} />
                      <CategoryBadge category={t.category_id ? categoryMap.get(t.category_id) ?? null : null} />
                    </div>
                  </div>
                  {t.status === "done" && <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />}
                </CardContent>
              </Card>
            ))}

            {selected?.habitDates.map((r) => {
              const habit = habitMap.get(r.habit_id);
              if (!habit) return null;
              return (
                <Card key={r.id}>
                  <CardContent className="flex items-center gap-2.5 p-3.5">
                    <Flame className="h-4 w-4" style={{ color: habit.color }} />
                    <p className="text-sm font-medium">{habit.name}</p>
                    <span className="ml-auto text-xs text-muted-foreground">習慣達成</span>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
