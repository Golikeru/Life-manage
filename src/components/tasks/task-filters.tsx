"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEADLINE_FILTER_LABEL, SORT_LABEL, type DeadlineFilter, type SortKey } from "@/lib/constants";
import type { Category } from "@/lib/types";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  deadlineFilter: DeadlineFilter;
  onDeadlineFilterChange: (v: DeadlineFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  sortKey: SortKey;
  onSortKeyChange: (v: SortKey) => void;
  categories: Category[];
  showCompleted: boolean;
  onShowCompletedChange: (v: boolean) => void;
}

export function TaskFilters({
  search,
  onSearchChange,
  deadlineFilter,
  onDeadlineFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortKey,
  onSortKeyChange,
  categories,
  showCompleted,
  onShowCompletedChange,
}: TaskFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-2.5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="タスクを検索"
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Select value={deadlineFilter} onValueChange={(v) => onDeadlineFilterChange(v as DeadlineFilter)}>
          <SelectTrigger className="w-[130px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(DEADLINE_FILTER_LABEL) as DeadlineFilter[]).map((k) => (
              <SelectItem key={k} value={k}>
                {DEADLINE_FILTER_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-[128px] shrink-0">
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全カテゴリ</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortKey} onValueChange={(v) => onSortKeyChange(v as SortKey)}>
          <SelectTrigger className="w-[116px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
              <SelectItem key={k} value={k}>
                {SORT_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => onShowCompletedChange(!showCompleted)}
          className="shrink-0 rounded-full border border-input bg-background px-3.5 text-xs font-medium text-muted-foreground data-[on=true]:border-primary data-[on=true]:bg-primary/10 data-[on=true]:text-primary"
          data-on={showCompleted}
        >
          完了済みを表示
        </button>
      </div>
    </div>
  );
}
