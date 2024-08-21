export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          date_time: string
          id: number
          provider_id: number
          service_id: number
          status: string
          user_id: string
        }
        Insert: {
          date_time: string
          id?: number
          provider_id: number
          service_id: number
          status: string
          user_id: string
        }
        Update: {
          date_time?: string
          id?: number
          provider_id?: number
          service_id?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      availability: {
        Row: {
          date: string
          end_time: string
          id: number
          provider_id: number
          start_time: string
        }
        Insert: {
          date: string
          end_time: string
          id?: number
          provider_id: number
          start_time: string
        }
        Update: {
          date?: string
          end_time?: string
          id?: number
          provider_id?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          availability_preferences: Json | null
          bio: string | null
          email: string
          id: number
          location: unknown | null
          location_name: string | null
          name: string
          phone_number: string | null
          photo_link: string | null
        }
        Insert: {
          availability_preferences?: Json | null
          bio?: string | null
          email: string
          id?: number
          location?: unknown | null
          location_name?: string | null
          name: string
          phone_number?: string | null
          photo_link?: string | null
        }
        Update: {
          availability_preferences?: Json | null
          bio?: string | null
          email?: string
          id?: number
          location?: unknown | null
          location_name?: string | null
          name?: string
          phone_number?: string | null
          photo_link?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          description: string | null
          duration: number
          id: number
          price: number
          provider_id: number | null
          service_name: string
        }
        Insert: {
          description?: string | null
          duration: number
          id?: number
          price: number
          provider_id?: number | null
          service_name: string
        }
        Update: {
          description?: string | null
          duration?: number
          id?: number
          price?: number
          provider_id?: number | null
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      users_provider: {
        Row: {
          id: number
          provider_id: number
          user_id: string
        }
        Insert: {
          id?: number
          provider_id: number
          user_id?: string
        }
        Update: {
          id?: number
          provider_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_users_provider_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_users_provider_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_provider_with_longlat: {
        Args: {
          input_id: number
        }
        Returns: Database["public"]["CompositeTypes"]["provider_with_longlat"][]
      }
      get_provider_with_max_availability_date: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["CompositeTypes"]["provider_with_max_availability_date"][]
      }
      is_admin: {
        Args: {
          p_id: number
        }
        Returns: boolean
      }
      is_provider: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      provider_with_longlat: {
        id: number | null
        email: string | null
        name: string | null
        bio: string | null
        photo_link: string | null
        phone_number: string | null
        location_name: string | null
        availability_preferences: Json | null
        location: unknown | null
        long: number | null
        lat: number | null
      }
      provider_with_max_availability_date: {
        id: number | null
        email: string | null
        name: string | null
        bio: string | null
        photo_link: string | null
        phone_number: string | null
        location_name: string | null
        availability_preferences: Json | null
        location: unknown | null
        max_date: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

