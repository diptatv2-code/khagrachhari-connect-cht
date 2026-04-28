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
      businesses: {
        Row: {
          address: string
          category: string
          created_at: string
          description: string | null
          google_maps_place_id: string | null
          hours: string | null
          id: string
          image_url: string | null
          is_open: boolean | null
          name_bn: string
          name_en: string | null
          phone: string
          rating: string | null
          section: string
          tag: string | null
          whatsapp: string | null
        }
        Insert: {
          address: string
          category: string
          created_at?: string
          description?: string | null
          google_maps_place_id?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          is_open?: boolean | null
          name_bn: string
          name_en?: string | null
          phone: string
          rating?: string | null
          section: string
          tag?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string
          category?: string
          created_at?: string
          description?: string | null
          google_maps_place_id?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          is_open?: boolean | null
          name_bn?: string
          name_en?: string | null
          phone?: string
          rating?: string | null
          section?: string
          tag?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          category: string
          condition: string
          created_at: string
          description: string | null
          expires_at: string
          id: string
          image_urls: string[] | null
          location: string
          phone: string
          price: number | null
          price_type: string
          report_count: number
          seller_name: string | null
          status: string
          title: string
          whatsapp: string | null
        }
        Insert: {
          category: string
          condition?: string
          created_at?: string
          description?: string | null
          expires_at?: string
          id?: string
          image_urls?: string[] | null
          location: string
          phone: string
          price?: number | null
          price_type?: string
          report_count?: number
          seller_name?: string | null
          status?: string
          title: string
          whatsapp?: string | null
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string
          description?: string | null
          expires_at?: string
          id?: string
          image_urls?: string[] | null
          location?: string
          phone?: string
          price?: number | null
          price_type?: string
          report_count?: number
          seller_name?: string | null
          status?: string
          title?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      marketplace_reports: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          reason: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          reason: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      food_restaurants: {
        Row: {
          id: string
          name: string
          name_bn: string | null
          description: string | null
          cuisine: string | null
          rating: number | null
          delivery_time: string | null
          delivery_charge: number | null
          min_order: number | null
          image_url: string | null
          phone: string | null
          address: string | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_bn?: string | null
          description?: string | null
          cuisine?: string | null
          rating?: number | null
          delivery_time?: string | null
          delivery_charge?: number | null
          min_order?: number | null
          image_url?: string | null
          phone?: string | null
          address?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["food_restaurants"]["Insert"]>
        Relationships: []
      }
      food_menu_items: {
        Row: {
          id: string
          restaurant_id: string | null
          name: string
          name_bn: string | null
          description: string | null
          price: number
          category: string | null
          image_url: string | null
          is_available: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id?: string | null
          name: string
          name_bn?: string | null
          description?: string | null
          price: number
          category?: string | null
          image_url?: string | null
          is_available?: boolean | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["food_menu_items"]["Insert"]>
        Relationships: []
      }
      food_orders: {
        Row: {
          id: string
          restaurant_id: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          items: Json
          total_amount: number
          delivery_charge: number | null
          status: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id?: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          items: Json
          total_amount: number
          delivery_charge?: number | null
          status?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["food_orders"]["Insert"]>
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          location: string | null
          job_type: string | null
          salary_range: string | null
          description: string
          requirements: string | null
          contact_phone: string | null
          contact_email: string | null
          application_deadline: string | null
          status: string | null
          posted_by_name: string | null
          posted_by_phone: string | null
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          title: string
          company: string
          location?: string | null
          job_type?: string | null
          salary_range?: string | null
          description: string
          requirements?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          application_deadline?: string | null
          status?: string | null
          posted_by_name?: string | null
          posted_by_phone?: string | null
          created_at?: string
          expires_at?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>
        Relationships: []
      }
      community_posts: {
        Row: {
          id: string
          title: string
          content: string
          category: string | null
          author_name: string
          author_phone: string | null
          likes_count: number | null
          comments_count: number | null
          is_approved: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category?: string | null
          author_name: string
          author_phone?: string | null
          likes_count?: number | null
          comments_count?: number | null
          is_approved?: boolean | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["community_posts"]["Insert"]>
        Relationships: []
      }
      community_comments: {
        Row: {
          id: string
          post_id: string | null
          author_name: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          author_name: string
          content: string
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["community_comments"]["Insert"]>
        Relationships: []
      }
      ride_requests: {
        Row: {
          id: string
          passenger_name: string
          passenger_phone: string
          pickup_location: string
          destination: string
          ride_type: string | null
          notes: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          passenger_name: string
          passenger_phone: string
          pickup_location: string
          destination: string
          ride_type?: string | null
          notes?: string | null
          status?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["ride_requests"]["Insert"]>
        Relationships: []
      }
      doctors: {
        Row: {
          id: string
          name: string
          name_en: string | null
          specialty: string
          specialty_key: string | null
          hospital: string | null
          upazila: string | null
          chamber_address: string | null
          phone: string | null
          experience_years: number | null
          rating: number | null
          visiting_hours: string | null
          fees: number | null
          note: string | null
          image_url: string | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_en?: string | null
          specialty: string
          specialty_key?: string | null
          hospital?: string | null
          upazila?: string | null
          chamber_address?: string | null
          phone?: string | null
          experience_years?: number | null
          rating?: number | null
          visiting_hours?: string | null
          fees?: number | null
          note?: string | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["doctors"]["Insert"]>
        Relationships: []
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
