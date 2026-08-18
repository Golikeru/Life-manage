"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const justConfirmed = searchParams.get("confirm") === "1";

  return (
    <Card>
      <CardContent className="pt-6">
        {justConfirmed && (
          <div className="mb-4 rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
            登録が完了しました。確認メールが届いている場合はリンクをクリックしてからログインしてください。
          </div>
        )}
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">パスワード</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending}>
            {pending ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
      </CardContent>
      <div className="pb-6 text-center text-sm text-muted-foreground">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          新規登録
        </Link>
      </div>
    </Card>
  );
}
