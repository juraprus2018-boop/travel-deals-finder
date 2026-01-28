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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      country_content: {
        Row: {
          country_name: string
          country_slug: string
          created_at: string
          hero_image: string | null
          highlights: string[] | null
          id: string
          intro_text: string | null
          meta_description: string | null
          meta_title: string | null
          seo_content: string | null
          updated_at: string
        }
        Insert: {
          country_name: string
          country_slug: string
          created_at?: string
          hero_image?: string | null
          highlights?: string[] | null
          id?: string
          intro_text?: string | null
          meta_description?: string | null
          meta_title?: string | null
          seo_content?: string | null
          updated_at?: string
        }
        Update: {
          country_name?: string
          country_slug?: string
          created_at?: string
          hero_image?: string | null
          highlights?: string[] | null
          id?: string
          intro_text?: string | null
          meta_description?: string | null
          meta_title?: string | null
          seo_content?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          average_temperature: string | null
          best_time_to_visit: string | null
          category: Database["public"]["Enums"]["category_type"]
          country: string
          country_code: string
          created_at: string
          currency: string | null
          hero_image: string | null
          highlights: string[] | null
          id: string
          is_published: boolean
          language: string | null
          lat: number
          lng: number
          name: string
          nearest_airport: string | null
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          average_temperature?: string | null
          best_time_to_visit?: string | null
          category: Database["public"]["Enums"]["category_type"]
          country: string
          country_code: string
          created_at?: string
          currency?: string | null
          hero_image?: string | null
          highlights?: string[] | null
          id?: string
          is_published?: boolean
          language?: string | null
          lat: number
          lng: number
          name: string
          nearest_airport?: string | null
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          average_temperature?: string | null
          best_time_to_visit?: string | null
          category?: Database["public"]["Enums"]["category_type"]
          country?: string
          country_code?: string
          created_at?: string
          currency?: string | null
          hero_image?: string | null
          highlights?: string[] | null
          id?: string
          is_published?: boolean
          language?: string | null
          lat?: number
          lng?: number
          name?: string
          nearest_airport?: string | null
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      generated_content: {
        Row: {
          destination_id: string
          generated_at: string
          id: string
          intro_text: string | null
          main_content: string | null
          meta_description: string | null
          page_type: Database["public"]["Enums"]["page_type"]
          tips: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          destination_id: string
          generated_at?: string
          id?: string
          intro_text?: string | null
          main_content?: string | null
          meta_description?: string | null
          page_type: Database["public"]["Enums"]["page_type"]
          tips?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          destination_id?: string
          generated_at?: string
          id?: string
          intro_text?: string | null
          main_content?: string | null
          meta_description?: string | null
          page_type?: Database["public"]["Enums"]["page_type"]
          tips?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_content_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          created_at: string
          cuisine_types: string[] | null
          destination_id: string
          google_maps_url: string | null
          google_place_id: string | null
          id: string
          is_open_now: boolean | null
          is_visible: boolean | null
          name: string
          opening_hours: string[] | null
          phone: string | null
          photo_url: string | null
          price_level: number | null
          rating: number | null
          sort_order: number | null
          updated_at: string
          user_ratings_total: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          cuisine_types?: string[] | null
          destination_id: string
          google_maps_url?: string | null
          google_place_id?: string | null
          id?: string
          is_open_now?: boolean | null
          is_visible?: boolean | null
          name: string
          opening_hours?: string[] | null
          phone?: string | null
          photo_url?: string | null
          price_level?: number | null
          rating?: number | null
          sort_order?: number | null
          updated_at?: string
          user_ratings_total?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          cuisine_types?: string[] | null
          destination_id?: string
          google_maps_url?: string | null
          google_place_id?: string | null
          id?: string
          is_open_now?: boolean | null
          is_visible?: boolean | null
          name?: string
          opening_hours?: string[] | null
          phone?: string | null
          photo_url?: string | null
          price_level?: number | null
          rating?: number | null
          sort_order?: number | null
          updated_at?: string
          user_ratings_total?: number | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      category_type:
        | "stedentrips"
        | "strandvakanties"
        | "wintersport"
        | "vakantieparken"
        | "pretparken"
      page_type:
        | "main"
        | "hotels"
        | "bezienswaardigheden"
        | "vliegtickets"
        | "restaurants"
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
    Enums: {
      app_role: ["admin", "user"],
      category_type: [
        "stedentrips",
        "strandvakanties",
        "wintersport",
        "vakantieparken",
        "pretparken",
      ],
      page_type: [
        "main",
        "hotels",
        "bezienswaardigheden",
        "vliegtickets",
        "restaurants",
      ],
    },
  },
} as const
