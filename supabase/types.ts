export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cosmic_cache: {
        Row: {
          cache_date: string
          created_at: string | null
          daily_message: string | null
          id: string
          moon_phase: string | null
          moon_sign: string | null
          planetary_transits: Json | null
        }
        Insert: {
          cache_date: string
          created_at?: string | null
          daily_message?: string | null
          id?: string
          moon_phase?: string | null
          moon_sign?: string | null
          planetary_transits?: Json | null
        }
        Update: {
          cache_date?: string
          created_at?: string | null
          daily_message?: string | null
          id?: string
          moon_phase?: string | null
          moon_sign?: string | null
          planetary_transits?: Json | null
        }
        Relationships: []
      }
      daily_streaks: {
        Row: {
          created_at: string | null
          id: string
          practice_date: string
          practices_completed: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          practice_date?: string
          practices_completed?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          practice_date?: string
          practices_completed?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emotional_checkins: {
        Row: {
          checkin_date: string
          created_at: string | null
          emotion_state: string
          id: string
          user_id: string
        }
        Insert: {
          checkin_date?: string
          created_at?: string | null
          emotion_state: string
          id?: string
          user_id: string
        }
        Update: {
          checkin_date?: string
          created_at?: string | null
          emotion_state?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotional_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          module_id: number | null
          prompt: string | null
          updated_at: string | null
          user_id: string
          word_count: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          module_id?: number | null
          prompt?: string | null
          updated_at?: string | null
          user_id: string
          word_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          module_id?: number | null
          prompt?: string | null
          updated_at?: string | null
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          facilitator: string | null
          id: string
          is_published: boolean | null
          max_participants: number | null
          meeting_password: string | null
          meeting_url: string | null
          session_date: string
          session_time: string
          session_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          facilitator?: string | null
          id?: string
          is_published?: boolean | null
          max_participants?: number | null
          meeting_password?: string | null
          meeting_url?: string | null
          session_date: string
          session_time: string
          session_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          facilitator?: string | null
          id?: string
          is_published?: boolean | null
          max_participants?: number | null
          meeting_password?: string | null
          meeting_url?: string | null
          session_date?: string
          session_time?: string
          session_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      modules: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          id: number
          sequence_order: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          id?: number
          sequence_order: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          id?: number
          sequence_order?: number
          title?: string
        }
        Relationships: []
      }
      practices: {
        Row: {
          audio_url: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          instructions: string | null
          title: string
          type: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          title: string
          type: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          birth_location: string | null
          birth_time: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          moon_sign: string | null
          rising_sign: string | null
          sun_sign: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          birth_location?: string | null
          birth_time?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          moon_sign?: string | null
          rising_sign?: string | null
          sun_sign?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          birth_location?: string | null
          birth_time?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          moon_sign?: string | null
          rising_sign?: string | null
          sun_sign?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      session_rsvps: {
        Row: {
          created_at: string | null
          id: string
          rsvp_status: string | null
          session_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rsvp_status?: string | null
          session_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rsvp_status?: string | null
          session_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_rsvps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          day_number: number | null
          id: string
          module_id: number | null
          practice_id: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          day_number?: number | null
          id?: string
          module_id?: number | null
          practice_id?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          day_number?: number | null
          id?: string
          module_id?: number | null
          practice_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

