"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const taskSchema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください").max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  priority: z.enum(["high", "medium", "low"]),
  deadline: z.string().optional().nullable(),
});

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

export async function createTask(input: unknown): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "入力内容を確認してください" };
  }

  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    category_id: parsed.data.category_id || null,
    priority: parsed.data.priority,
    deadline: parsed.data.deadline || null,
  });

  if (error) return { error: "タスクの作成に失敗しました" };
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return {};
}

export async function updateTask(id: string, input: unknown): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "入力内容を確認してください" };
  }

  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("tasks")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      category_id: parsed.data.category_id || null,
      priority: parsed.data.priority,
      deadline: parsed.data.deadline || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "タスクの更新に失敗しました" };
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return {};
}

export async function deleteTask(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: "タスクの削除に失敗しました" };
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return {};
}

export async function setTaskStatus(id: string, status: "todo" | "in_progress" | "done"): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "更新に失敗しました" };
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return {};
}
