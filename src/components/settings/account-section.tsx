import { LogOut, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/(auth)/actions";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export function AccountSection({ email, createdAt }: { email: string; createdAt: string }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">アカウント</h2>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{email}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(createdAt), "yyyy年M月d日", { locale: ja })} から利用開始
            </p>
          </div>
        </CardContent>
      </Card>

      <form action={logoutAction} className="mt-3">
        <Button type="submit" variant="outline" className="w-full text-destructive hover:text-destructive">
          <LogOut className="h-4 w-4" /> ログアウト
        </Button>
      </form>
    </section>
  );
}
