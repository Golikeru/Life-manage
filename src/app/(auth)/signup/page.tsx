"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction, type AuthFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const initialState: AuthFormState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">お名前（任意）</Label>
            <Input id="name" name="name" type="text" autoComplete="name" placeholder="山田 太郎" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">パスワード</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="6文字以上" required minLength={6} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="passwordConfirm">パスワード（確認）</Label>
            <Input id="passwordConfirm" name="passwordConfirm" type="password" autoComplete="new-password" placeholder="再入力してください" required minLength={6} />
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending}>
            {pending ? "登録中..." : "新規登録"}
          </Button>
        </form>
      </CardContent>
      <div className="pb-6 text-center text-sm text-muted-foreground">
        既にアカウントをお持ちの方は{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          ログイン
        </Link>
      </div>
    </Card>
  );
}
