import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoryBadge({
  category,
  className,
}: {
  category: Pick<Category, "name" | "color"> | null;
  className?: string;
}) {
  if (!category) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground", className)}>
        未分類
      </span>
    );
  }
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", className)}
      style={{ backgroundColor: `${category.color}1A`, color: category.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: category.color }} />
      {category.name}
    </span>
  );
}
