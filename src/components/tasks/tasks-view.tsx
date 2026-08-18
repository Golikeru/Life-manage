"use client";

import { useMemo, useState } from "react";
import { Plus, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskItem } from "@/components/tasks/task-item";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { matchesDeadlineFilter } from "@/lib/date-utils";
import { PRIORITY_CONFIG, type DeadlineFilter, type SortKey } from "@/lib/constants";
import type { Category, Task } from "@/lib/types";

export function TasksView({ tasks, categories }: { tasks: Task[]; categories: Category[] }) {
  const [search, setSearch] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("deadline");
  const [showCompleted, setShowCompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const visibleTasks = useMemo(() => {
    let list = tasks.filter((t) => (showCompleted ? true : t.status !== "done"));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      list = list.filter((t) => t.category_id === categoryFilter);
    }

    list = list.filter((t) => matchesDeadlineFilter(t.deadline, t.status, deadlineFilter));

    const sorted = [...list].sort((a, b) => {
      switch (sortKey) {
        case "priority":
          return PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
        case "title":
          return a.title.localeCompare(b.title, "ja");
        case "created_at":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "deadline":
        default: {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
      }
    });

    return sorted;
  }, [tasks, search, categoryFilter, deadlineFilter, sortKey, showCompleted]);

  function openCreate() {
    setEditingTask(null);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  return (
    <div>
      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        deadlineFilter={deadlineFilter}
        onDeadlineFilterChange={setDeadlineFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        categories={categories}
        showCompleted={showCompleted}
        onShowCompletedChange={setShowCompleted}
      />

      <Button onClick={openCreate} className="mb-4 w-full" size="lg">
        <Plus className="h-4 w-4" /> 新しいタスク
      </Button>

      {visibleTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="タスクが見つかりません"
          description="条件を変更するか、新しいタスクを追加しましょう。"
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              category={task.category_id ? categoryMap.get(task.category_id) ?? null : null}
              onEdit={() => openEdit(task)}
            />
          ))}
        </div>
      )}

      <TaskFormDialog open={dialogOpen} onOpenChange={setDialogOpen} categories={categories} task={editingTask} />
    </div>
  );
}
