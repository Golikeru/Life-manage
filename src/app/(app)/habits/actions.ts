"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const habitSchema = z.object({
  name: z.string().trim().min(1, "習慣名を入力してください").max(100),
  frequency: z.enum(["daily", "weekly"]),
  target_count: z.number().int().min(1).max(7),
  color: z.string().min(1),
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

export async function createHabit(input: unknown): Promise<ActionResult> {
  const parsed = habitSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "入力内容を確認してください" };

  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase.from("habits").insert({ user_id: user.id, ...parsed.data });
  if (error) return { error: "習慣の作成に失敗しました" };

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return {};
}

export async function updateHabit(id: string, input: unknown): Promise<ActionResult> {
  const parsed = habitSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "入力内容を確認してください" };

  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase.from("habits").update(parsed.data).eq("id", id).eq("user_id", user.id);
  if (error) return { error: "習慣の更新に失敗しました" };

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return {};
}

export async function deleteHabit(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase.from("habits").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: "習慣の削除に失敗しました" };

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return {};
}

export async function toggleHabitRecord(habitId: string, date: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow();

  const { data: existing } = await supabase
    .from("habit_records")
    .select("id")
    .eq("habit_id", habitId)
    .eq("date", date)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("habit_records").delete().eq("id", existing.id);
    if (error) return { error: "更新に失敗しました" };
  } else {
    const { error } = await supabase
      .from("habit_records")
      .insert({ habit_id: habitId, user_id: user.id, date, completed: true });
    if (error) return { error: "更新に失敗しました" };
  }

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return {};
}
