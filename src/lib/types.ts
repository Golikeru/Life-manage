// ============================================================================
// Supabaseのテーブル定義に対応する型。
// スキーマを変更した場合はこのファイルも合わせて更新してください。
// （本来は `supabase gen types typescript` で自動生成できます）
// ============================================================================

export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";
export type HabitFrequency = "daily" | "weekly";

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          is_default: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          is_default?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
        };

      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category_id: string | null;
          priority: Priority;
          deadline: string | null;
          status: TaskStatus;
          completed_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category_id?: string | null;
          priority?: Priority;
          deadline?: string | null;
          status?: TaskStatus;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
        };

      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          frequency: HabitFrequency;
          target_count: number;
          color: string;
          archived: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          frequency?: HabitFrequency;
          target_count?: number;
          color?: string;
          archived?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["habits"]["Insert"]>;
        Relationships: [];
        };

      habit_records: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          date: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["habit_records"]["Insert"]>;
        Relationships: [];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitRecord = Database["public"]["Tables"]["habit_records"]["Row"];

export type TaskWithCategory = Task & { category: Category | null };
