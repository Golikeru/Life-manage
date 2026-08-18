"use client";

import { useTransition } from "react";
import { MoreVertical, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { CategoryBadge } from "@/components/shared/category-badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { setTaskStatus, deleteTask } from "@/app/(app)/tasks/actions";
import { formatDate, isOverdue } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { Category, Task } from "@/lib/types";

export function TaskItem({
  task,
  category,
  onEdit,
}: {
  task: Task;
  category: Category | null;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const done = task.status === "done";
  const overdue = isOverdue(task.deadline, task.status);

  function toggle() {
    startTransition(() => {
      setTaskStatus(task.id, done ? "todo" : "done");
    });
  }

  function handleDelete() {
    startTransition(() => {
      deleteTask(task.id);
    });
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-opacity",
        pending && "opacity-60",
        overdue && !done && "border-destructive/40 bg-destructive/[0.04]"
      )}
    >
      <Checkbox checked={done} onCheckedChange={toggle} className="mt-0.5" disabled={pending} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("truncate text-sm font-medium", done && "text-muted-foreground line-through")}>
            {task.title}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mr-1 -mt-1">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={onEdit}>
                <Pencil className="mr-2 h-4 w-4" /> 編集
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> 削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          <CategoryBadge category={category} />
          {task.deadline && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                overdue && !done ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
              )}
            >
              {overdue && !done && <AlertCircle className="h-3 w-3" />}
              {formatDate(task.deadline)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
