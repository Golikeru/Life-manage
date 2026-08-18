import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  accentClass = "bg-primary/10 text-primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  accentClass?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", accentClass)}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div>
          <p className="text-xl font-semibold leading-none tracking-tight">
            {value}
            {suffix && <span className="ml-0.5 text-sm font-medium text-muted-foreground">{suffix}</span>}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
