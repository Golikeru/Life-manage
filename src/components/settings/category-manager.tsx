"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { createCategory, deleteCategory } from "@/app/(app)/settings/actions";
import { DEFAULT_CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";
import type { CategoryStat } from "@/lib/stats";

export function CategoryManager({
  categories,
  statsMap,
}: {
  categories: Category[];
  statsMap: Record<string, CategoryStat>;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_CATEGORY_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCategory({ name, color });
      if (result.error) {
        setError(result.error);
        return;
      }
      setName("");
      setColor(DEFAULT_CATEGORY_COLORS[0]);
      setAdding(false);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("このカテゴリを削除しますか？関連タスクは「未分類」になります。")) return;
    startTransition(() => {
      deleteCategory(id);
    });
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">カテゴリ</h2>
        <Button variant="ghost" size="sm" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" /> 追加
        </Button>
      </div>

      {adding && (
        <Card className="mb-3">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="カテゴリ名"
                maxLength={50}
                required
                autoFocus
              />
              <div className="flex flex-wrap gap-2">
                {DEFAULT_CATEGORY_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-transform",
                      color === c ? "scale-110 border-foreground" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setAdding(false)}>
                  キャンセル
                </Button>
                <Button type="submit" className="flex-1" disabled={pending}>
                  {pending ? "追加中..." : "追加する"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {categories.map((c) => {
          const stat = statsMap[c.id];
          return (
            <Card key={c.id}>
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                  <p className="flex-1 truncate text-sm font-medium">{c.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {stat ? `${stat.completed}/${stat.total}件` : "0件"}
                  </span>
                  {!c.is_default && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {stat && stat.total > 0 && (
                  <Progress
                    value={stat.rate}
                    className="mt-2.5 h-1.5"
                    indicatorClassName="bg-[var(--cat-color)]"
                    style={{ "--cat-color": c.color } as React.CSSProperties}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
