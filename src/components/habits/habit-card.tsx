"use client";

import { useTransition } from "react";
import { Flame, MoreVertical, Pencil, Trash2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HabitHistoryGrid } from "@/components/habits/habit-history-grid";
import { toggleHabitRecord } from "@/app/(app)/habits/actions";
import { calculateStreak, countThisWeek, toRecordMap } from "@/lib/habit-utils";
import { FREQUENCY_LABEL } from "@/lib/constants";
import { todayStr } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { Habit, HabitRecord } from "@/lib/types";

export function HabitCard({
  habit,
  records,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  records: HabitRecord[];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const today = todayStr();
  const recordMap = toRecordMap(records);
  const doneToday = recordMap.get(today) ?? false;
  const streak = calculateStreak(habit, records);
  const weekCount = countThisWeek(records);
  const recordDates = new Set(records.filter((r) => r.completed).map((r) => r.date));

  function handleToggleToday() {
    startTransition(() => {
      toggleHabitRecord(habit.id, today);
    });
  }

  return (
    <Card className={cn(pending && "opacity-60")}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: habit.color }} />
            <div>
              <p className="text-sm font-semibold">{habit.name}</p>
              <p className="text-xs text-muted-foreground">
                {FREQUENCY_LABEL[habit.frequency]}
                {habit.frequency === "weekly" && ` ・ 週${habit.target_count}回`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
              <Flame className="h-3.5 w-3.5" />
              {streak}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" /> 編集
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> 削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {habit.frequency === "weekly" && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>今週の進捗</span>
              <span>
                {weekCount}/{habit.target_count}
              </span>
            </div>
            <Progress value={Math.min(100, (weekCount / habit.target_count) * 100)} />
          </div>
        )}

        <div className="mt-4">
          <HabitHistoryGrid recordDates={recordDates} color={habit.color} />
        </div>

        <button
          type="button"
          onClick={handleToggleToday}
          disabled={pending}
          className={cn(
            "mt-4 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors",
            doneToday
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-dashed border-input text-muted-foreground hover:bg-muted"
          )}
        >
          <Check className="h-4 w-4" />
          {doneToday ? "今日は達成済み" : "今日のチェック"}
        </button>
      </CardContent>
    </Card>
  );
}
