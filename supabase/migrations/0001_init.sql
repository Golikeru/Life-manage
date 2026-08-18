-- ============================================================================
-- Life Manager - 初期スキーマ
-- Supabaseの SQL Editor で実行するか、Supabase CLI (supabase db push) で適用してください。
-- ============================================================================

-- 拡張機能: UUID生成
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- updated_at を自動更新する共通関数
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- categories: カテゴリ
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#8E8E93',
  is_default boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories(user_id);

alter table public.categories enable row level security;

create policy "categories_select_own" on public.categories
  for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories
  for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories
  for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- tasks: ToDoタスク
-- ----------------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  deadline date,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_category_id_idx on public.tasks(category_id);
create index if not exists tasks_deadline_idx on public.tasks(deadline);
create index if not exists tasks_status_idx on public.tasks(status);

alter table public.tasks enable row level security;

create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = user_id);

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- habits: 習慣
-- ----------------------------------------------------------------------------
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly')),
  target_count integer not null default 1,
  color text not null default '#0A84FF',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists habits_user_id_idx on public.habits(user_id);

alter table public.habits enable row level security;

create policy "habits_select_own" on public.habits
  for select using (auth.uid() = user_id);
create policy "habits_insert_own" on public.habits
  for insert with check (auth.uid() = user_id);
create policy "habits_update_own" on public.habits
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits_delete_own" on public.habits
  for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- habit_records: 習慣の達成記録 (1習慣・1日につき1レコード)
-- user_id を非正規化して保持することで、RLSをシンプルかつ高速に保つ
-- ----------------------------------------------------------------------------
create table if not exists public.habit_records (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);

create index if not exists habit_records_habit_id_idx on public.habit_records(habit_id);
create index if not exists habit_records_user_id_idx on public.habit_records(user_id);
create index if not exists habit_records_date_idx on public.habit_records(date);

alter table public.habit_records enable row level security;

create policy "habit_records_select_own" on public.habit_records
  for select using (auth.uid() = user_id);
create policy "habit_records_insert_own" on public.habit_records
  for insert with check (auth.uid() = user_id);
create policy "habit_records_update_own" on public.habit_records
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habit_records_delete_own" on public.habit_records
  for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 新規ユーザー登録時に初期カテゴリを自動作成
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user_defaults()
returns trigger as $$
begin
  insert into public.categories (user_id, name, color, is_default, sort_order)
  values
    (new.id, '就職活動', '#0A84FF', true, 1),
    (new.id, '英語・資格', '#5E5CE6', true, 2),
    (new.id, '大学・研究', '#30B0C7', true, 3),
    (new.id, 'アルバイト', '#FF9F0A', true, 4),
    (new.id, '運動・健康', '#34C759', true, 5),
    (new.id, '趣味', '#FF375F', true, 6),
    (new.id, 'その他', '#8E8E93', true, 7);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user_defaults();

-- ----------------------------------------------------------------------------
-- Realtime を有効化 (任意: ダッシュボードの自動更新に利用可能)
-- ----------------------------------------------------------------------------
-- alter publication supabase_realtime add table public.tasks, public.habits, public.habit_records;
