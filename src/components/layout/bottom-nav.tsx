"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ListChecks, Flame, CalendarDays, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "ホーム", icon: LayoutGrid },
  { href: "/tasks", label: "タスク", icon: ListChecks },
  { href: "/habits", label: "習慣", icon: Flame },
  { href: "/calendar", label: "カレンダー", icon: CalendarDays },
  { href: "/settings", label: "設定", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/90 backdrop-blur-lg safe-bottom">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-2 sm:max-w-2xl">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
                strokeWidth={active ? 2.4 : 2}
              />
              <span className={cn(active ? "text-primary" : "text-muted-foreground")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
