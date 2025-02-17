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
      custom_preferences: {
        Row: {
          created_at: string | null
          driver_id: string | null
          id: string
          preference: string
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          preference: string
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          preference?: string
        }
        Relationships: []
      }
      driver_preferences: {
        Row: {
          created_at: string | null
          driver_id: string | null
          id: string
          pets_allowed: boolean | null
          smoking_allowed: boolean | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          pets_allowed?: boolean | null
          smoking_allowed?: boolean | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          pets_allowed?: boolean | null
          smoking_allowed?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          user_type: Database["public"]["Enums"]["user_type"] | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
        }
        Relationships: []
      }
      ride_bookings: {
        Row: {
          booking_status: string | null
          cancelled_at: string | null
          created_at: string | null
          id: string
          passenger_id: string
          ride_id: string
        }
        Insert: {
          booking_status?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          passenger_id: string
          ride_id: string
        }
        Update: {
          booking_status?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          passenger_id?: string
          ride_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_bookings_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_validations: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          id: string
          is_validated: boolean
          rating: number | null
          validation_status: string | null
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_validated: boolean
          rating?: number | null
          validation_status?: string | null
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_validated?: boolean
          rating?: number | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ride_validations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "ride_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          arrival_address: string
          arrival_time: string
          available_seats: number
          completed_at: string | null
          created_at: string | null
          departure_address: string
          departure_time: string
          driver_id: string
          id: string
          price: number
          status: string | null
          vehicle_id: string
        }
        Insert: {
          arrival_address: string
          arrival_time: string
          available_seats: number
          completed_at?: string | null
          created_at?: string | null
          departure_address: string
          departure_time: string
          driver_id: string
          id?: string
          price: number
          status?: string | null
          vehicle_id: string
        }
        Update: {
          arrival_address?: string
          arrival_time?: string
          available_seats?: number
          completed_at?: string | null
          created_at?: string | null
          departure_address?: string
          departure_time?: string
          driver_id?: string
          id?: string
          price?: number
          status?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rides_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string | null
          credits: number
          id: string
          pending_credits: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits?: number
          id?: string
          pending_credits?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits?: number
          id?: string
          pending_credits?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string | null
          color: string | null
          created_at: string | null
          id: string
          license_plate: string | null
          model: string | null
          owner_id: string | null
          registration_date: string | null
          seats: number | null
        }
        Insert: {
          brand?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          license_plate?: string | null
          model?: string | null
          owner_id?: string | null
          registration_date?: string | null
          seats?: number | null
        }
        Update: {
          brand?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          license_plate?: string | null
          model?: string | null
          owner_id?: string | null
          registration_date?: string | null
          seats?: number | null
        }
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
      user_type: "passenger" | "driver" | "both" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
