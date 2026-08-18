"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { deleteHabit } from "@/app/(app)/habits/actions";
import type { Habit, HabitRecord } from "@/lib/types";

export function HabitsView({ habits, records }: { habits: Habit[]; records: HabitRecord[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [, startTransition] = useTransition();

  const recordsByHabit = useMemo(() => {
    const map = new Map<string, HabitRecord[]>();
    for (const r of records) {
      const list = map.get(r.habit_id) ?? [];
      list.push(r);
      map.set(r.habit_id, list);
    }
    return map;
  }, [records]);

  function openCreate() {
    setEditingHabit(null);
    setDialogOpen(true);
  }

  function openEdit(habit: Habit) {
    setEditingHabit(habit);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("この習慣を削除しますか？記録もすべて削除されます。")) return;
    startTransition(() => {
      deleteHabit(id);
    });
  }

  return (
    <div>
      <Button onClick={openCreate} className="mb-4 w-full" size="lg">
        <Plus className="h-4 w-4" /> 新しい習慣
      </Button>

      {habits.length === 0 ? (
        <EmptyState icon={Flame} title="習慣が登録されていません" description="継続したい行動を登録してみましょう。" />
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              records={recordsByHabit.get(habit.id) ?? []}
              onEdit={() => openEdit(habit)}
              onDelete={() => handleDelete(habit.id)}
            />
          ))}
        </div>
      )}

      <HabitFormDialog open={dialogOpen} onOpenChange={setDialogOpen} habit={editingHabit} />
    </div>
  );
}
