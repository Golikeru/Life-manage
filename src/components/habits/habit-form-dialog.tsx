"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createHabit, updateHabit } from "@/app/(app)/habits/actions";
import { DEFAULT_CATEGORY_COLORS } from "@/lib/constants";
import type { Habit, HabitFrequency } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HabitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit | null;
}

const EMPTY_FORM = {
  name: "",
  frequency: "daily" as HabitFrequency,
  target_count: 1,
  color: DEFAULT_CATEGORY_COLORS[0],
};

export function HabitFormDialog({ open, onOpenChange, habit }: HabitFormDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setError(null);
      setForm(
        habit
          ? {
              name: habit.name,
              frequency: habit.frequency,
              target_count: habit.target_count,
              color: habit.color,
            }
          : EMPTY_FORM
      );
    }
  }, [open, habit]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = habit ? await updateHabit(habit.id, form) : await createHabit(form);
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{habit ? "習慣を編集" : "新しい習慣"}</DialogTitle>
          <DialogDescription>継続したい行動を登録しましょう。</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-name">習慣名</Label>
            <Input
              id="habit-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="例: ランニング"
              required
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>頻度</Label>
              <Select
                value={form.frequency}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, frequency: v as HabitFrequency, target_count: v === "daily" ? 1 : f.target_count }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">毎日</SelectItem>
                  <SelectItem value="weekly">毎週</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.frequency === "weekly" && (
              <div className="flex flex-col gap-1.5">
                <Label>週の目標回数</Label>
                <Select
                  value={String(form.target_count)}
                  onValueChange={(v) => setForm((f) => ({ ...f, target_count: Number(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        週{n}回
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>カラー</Label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-transform",
                    form.color === c ? "scale-110 border-foreground" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
