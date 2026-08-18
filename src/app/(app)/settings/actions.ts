"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
}

async function getUserOrThrow() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("認証されていません");
  return { supabase, user };
}

const categorySchema = z.object({
  name: z.string().trim().min(1, "カテゴリ名を入力してください").max(50),
  color: z.string().min(1),
});

export async function createCategory(input: unknown): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "入力内容を確認してください" };

  const { supabase, user } = await getUserOrThrow();

  const { count } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name: parsed.data.name,
    color: parsed.data.color,
    sort_order: (count ?? 0) + 1,
  });

  if (error) return { error: "カテゴリの作成に失敗しました" };
  revalidatePath("/settings");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase.from("categories").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: "カテゴリの削除に失敗しました" };

  revalidatePath("/settings");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return {};
}
