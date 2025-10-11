export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cities: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          is_active: boolean
          lat: number | null
          lng: number | null
          name_en: string
          name_es: string
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id: string
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          name_en: string
          name_es: string
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          name_en?: string
          name_es?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          city_id: string
          contact_email: string | null
          contact_instagram: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          created_at: string
          date: string
          description: string | null
          eco_conscious: boolean | null
          featured: boolean | null
          hidden_by_reports: boolean | null
          id: string
          image_url: string | null
          lat: number
          lng: number
          location_directions: string | null
          location_name: string
          organizer_contact: string | null
          organizer_name: string | null
          price: string | null
          profile_id: string | null
          time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          city_id?: string
          contact_email?: string | null
          contact_instagram?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          date: string
          description?: string | null
          eco_conscious?: boolean | null
          featured?: boolean | null
          hidden_by_reports?: boolean | null
          id?: string
          image_url?: string | null
          lat: number
          lng: number
          location_directions?: string | null
          location_name: string
          organizer_contact?: string | null
          organizer_name?: string | null
          price?: string | null
          profile_id?: string | null
          time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          city_id?: string
          contact_email?: string | null
          contact_instagram?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          date?: string
          description?: string | null
          eco_conscious?: boolean | null
          featured?: boolean | null
          hidden_by_reports?: boolean | null
          id?: string
          image_url?: string | null
          lat?: number
          lng?: number
          location_directions?: string | null
          location_name?: string
          organizer_contact?: string | null
          organizer_name?: string | null
          price?: string | null
          profile_id?: string | null
          time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          admin_notes: string | null
          category: string | null
          created_at: string
          description: string
          device_info: Json | null
          id: string
          priority: string | null
          status: string
          title: string
          type: string
          updated_at: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          description: string
          device_info?: Json | null
          id?: string
          priority?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          description?: string
          device_info?: Json | null
          id?: string
          priority?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_history: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          delivered: boolean | null
          expo_receipt: Json | null
          expo_ticket_id: string | null
          id: string
          notification_type: string
          opened: boolean | null
          opened_at: string | null
          push_token_id: string | null
          sent_at: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          delivered?: boolean | null
          expo_receipt?: Json | null
          expo_ticket_id?: string | null
          id?: string
          notification_type: string
          opened?: boolean | null
          opened_at?: string | null
          push_token_id?: string | null
          sent_at?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          delivered?: boolean | null
          expo_receipt?: Json | null
          expo_ticket_id?: string | null
          id?: string
          notification_type?: string
          opened?: boolean | null
          opened_at?: string | null
          push_token_id?: string | null
          sent_at?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_history_push_token_id_fkey"
            columns: ["push_token_id"]
            isOneToOne: false
            referencedRelation: "push_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          event_reminders: boolean | null
          event_updates: boolean | null
          favorite_categories: Json | null
          new_events: boolean | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          reminder_1d_before: boolean | null
          reminder_1h_before: boolean | null
          reminder_1w_before: boolean | null
          updated_at: string | null
          user_id: string
          weekly_digest: boolean | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          event_reminders?: boolean | null
          event_updates?: boolean | null
          favorite_categories?: Json | null
          new_events?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_1d_before?: boolean | null
          reminder_1h_before?: boolean | null
          reminder_1w_before?: boolean | null
          updated_at?: string | null
          user_id: string
          weekly_digest?: boolean | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          event_reminders?: boolean | null
          event_updates?: boolean | null
          favorite_categories?: Json | null
          new_events?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_1d_before?: boolean | null
          reminder_1h_before?: boolean | null
          reminder_1w_before?: boolean | null
          updated_at?: string | null
          user_id?: string
          weekly_digest?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          error_message: string | null
          id: string
          notification_type: string
          retry_count: number | null
          scheduled_for: string
          sent_at: string | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          id?: string
          notification_type: string
          retry_count?: number | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          id?: string
          notification_type?: string
          retry_count?: number | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          category: string
          city_id: string
          contact_email: string | null
          contact_instagram: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          created_at: string
          created_by: string | null
          description: string
          eco_conscious: boolean | null
          featured: boolean | null
          hidden_by_reports: boolean | null
          hours: string | null
          id: string
          images: string[] | null
          lat: number
          lng: number
          location_name: string
          name: string
          price_range: string | null
          tags: string[] | null
          type: string
          updated_at: string
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          category: string
          city_id?: string
          contact_email?: string | null
          contact_instagram?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          eco_conscious?: boolean | null
          featured?: boolean | null
          hidden_by_reports?: boolean | null
          hours?: string | null
          id?: string
          images?: string[] | null
          lat: number
          lng: number
          location_name: string
          name: string
          price_range?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          category?: string
          city_id?: string
          contact_email?: string | null
          contact_instagram?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          eco_conscious?: boolean | null
          featured?: boolean | null
          hidden_by_reports?: boolean | null
          hours?: string | null
          id?: string
          images?: string[] | null
          lat?: number
          lng?: number
          location_name?: string
          name?: string
          price_range?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "places_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_stats: {
        Row: {
          avg_response_time: string | null
          member_since: string | null
          profile_id: string
          services_count: number | null
          total_views: number | null
          updated_at: string | null
        }
        Insert: {
          avg_response_time?: string | null
          member_since?: string | null
          profile_id: string
          services_count?: number | null
          total_views?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_response_time?: string | null
          member_since?: string | null
          profile_id?: string
          services_count?: number | null
          total_views?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_stats_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about: string | null
          avatar_url: string | null
          created_at: string
          creator_verified: boolean | null
          id: string
          is_admin: boolean | null
          languages: string[] | null
          location: string | null
          name: string | null
          show_contact_on_profile: boolean | null
          social_instagram: string | null
          social_website: string | null
          social_whatsapp: string | null
          updated_at: string
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          created_at?: string
          creator_verified?: boolean | null
          id: string
          is_admin?: boolean | null
          languages?: string[] | null
          location?: string | null
          name?: string | null
          show_contact_on_profile?: boolean | null
          social_instagram?: string | null
          social_website?: string | null
          social_whatsapp?: string | null
          updated_at?: string
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          created_at?: string
          creator_verified?: boolean | null
          id?: string
          is_admin?: boolean | null
          languages?: string[] | null
          location?: string | null
          name?: string | null
          show_contact_on_profile?: boolean | null
          social_instagram?: string | null
          social_website?: string | null
          social_whatsapp?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          app_version: string | null
          created_at: string | null
          device_name: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          platform: string
          token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app_version?: string | null
          created_at?: string | null
          device_name?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          platform: string
          token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app_version?: string | null
          created_at?: string | null
          device_name?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          platform?: string
          token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          item_id: string
          item_type: string
          reason: string
          reporter_id: string | null
          resolution_action: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_id: string
          item_type: string
          reason: string
          reporter_id?: string | null
          resolution_action?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_id?: string
          item_type?: string
          reason?: string
          reporter_id?: string | null
          resolution_action?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          last_notified_at: string | null
          name: string
          notify_on_match: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters: Json
          id?: string
          last_notified_at?: string | null
          name: string
          notify_on_match?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          last_notified_at?: string | null
          name?: string
          notify_on_match?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          availability_schedule: Json | null
          available: boolean | null
          category: string
          contact_methods: string[] | null
          created_at: string
          delivery_options: string[] | null
          description: string
          eco_conscious: boolean | null
          featured: boolean | null
          hidden_by_reports: boolean | null
          id: string
          images: string[] | null
          price_amount: number | null
          price_currency: string | null
          price_notes: string | null
          price_type: string | null
          profile_id: string
          response_time: string | null
          service_location: string | null
          title: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          availability_schedule?: Json | null
          available?: boolean | null
          category: string
          contact_methods?: string[] | null
          created_at?: string
          delivery_options?: string[] | null
          description: string
          eco_conscious?: boolean | null
          featured?: boolean | null
          hidden_by_reports?: boolean | null
          id?: string
          images?: string[] | null
          price_amount?: number | null
          price_currency?: string | null
          price_notes?: string | null
          price_type?: string | null
          profile_id: string
          response_time?: string | null
          service_location?: string | null
          title: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          availability_schedule?: Json | null
          available?: boolean | null
          category?: string
          contact_methods?: string[] | null
          created_at?: string
          delivery_options?: string[] | null
          description?: string
          eco_conscious?: boolean | null
          featured?: boolean | null
          hidden_by_reports?: boolean | null
          id?: string
          images?: string[] | null
          price_amount?: number | null
          price_currency?: string | null
          price_notes?: string | null
          price_type?: string | null
          profile_id?: string
          response_time?: string | null
          service_location?: string | null
          title?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "services_profile_id_fkey"
            columns: ["profile_id"]
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
      admin_delete_event: {
        Args: { admin_user_id: string; event_id: string }
        Returns: boolean
      }
      admin_delete_place: {
        Args: { admin_user_id: string; place_id: string }
        Returns: boolean
      }
      admin_get_event: {
        Args: { admin_user_id: string; event_id: string }
        Returns: {
          category: string
          city_id: string
          contact_email: string
          contact_instagram: string
          contact_phone: string
          contact_whatsapp: string
          created_at: string
          date: string
          description: string
          eco_conscious: boolean
          featured: boolean
          hidden_by_reports: boolean
          id: string
          image_url: string
          images: string[]
          lat: number
          lng: number
          location_directions: string
          location_name: string
          organizer_contact: string
          organizer_name: string
          price: string
          profile_id: string
          time: string
          title: string
          updated_at: string
        }[]
      }
      admin_get_place: {
        Args: { admin_user_id: string; place_id: string }
        Returns: {
          category: string
          city_id: string
          contact_email: string
          contact_instagram: string
          contact_phone: string
          contact_whatsapp: string
          created_at: string
          created_by: string
          description: string
          eco_conscious: boolean
          featured: boolean
          hidden_by_reports: boolean
          hours: string
          id: string
          images: string[]
          lat: number
          lng: number
          location_name: string
          name: string
          price_range: string
          tags: string[]
          type: string
          updated_at: string
          verified: boolean
          website_url: string
        }[]
      }
      admin_hide_event: {
        Args: { admin_user_id: string; event_id: string }
        Returns: boolean
      }
      admin_hide_place: {
        Args: { admin_user_id: string; place_id: string }
        Returns: boolean
      }
      admin_restore_event: {
        Args: { admin_user_id: string; event_id: string }
        Returns: boolean
      }
      admin_restore_place: {
        Args: { admin_user_id: string; place_id: string }
        Returns: boolean
      }
      cleanup_inactive_push_tokens: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_active_push_tokens: {
        Args: { p_user_id: string }
        Returns: {
          platform: string
          token: string
        }[]
      }
      get_report_count: {
        Args: { p_item_id: string; p_item_type: string }
        Returns: number
      }
      is_in_quiet_hours: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      uuid_generate_v1: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v1mc: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v3: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v5: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_nil: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_dns: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_oid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_x500: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
