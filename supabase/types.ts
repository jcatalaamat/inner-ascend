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
      profiles: {
        Row: {
          about: string | null
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
