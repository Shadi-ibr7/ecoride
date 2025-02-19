export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string
          full_name: string
          avatar_url: string
          rating: number
          preferences: string[]
          user_type: 'passenger' | 'driver' | 'both' | 'admin' | null
        }
        Insert: {
          id: string
          created_at?: string
          username: string
          full_name: string
          avatar_url?: string
          rating?: number
          preferences?: string[]
          user_type?: 'passenger' | 'driver' | 'both' | 'admin'
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          full_name?: string
          avatar_url?: string
          rating?: number
          preferences?: string[]
          user_type?: 'passenger' | 'driver' | 'both' | 'admin'
        }
      }
      rides: {
        Row: {
          id: number
          created_at: string
          driver_id: string
          departure_city: string
          arrival_city: string
          departure_time: string
          arrival_time: string
          available_seats: number
          price: number
          is_ecological: boolean
          vehicle_brand: string
          vehicle_model: string
          vehicle_energy_type: string
        }
        Insert: {
          id?: number
          created_at?: string
          driver_id: string
          departure_city: string
          arrival_city: string
          departure_time: string
          arrival_time: string
          available_seats: number
          price: number
          is_ecological?: boolean
          vehicle_brand: string
          vehicle_model: string
          vehicle_energy_type: string
        }
        Update: {
          id?: number
          created_at?: string
          driver_id?: string
          departure_city?: string
          arrival_city?: string
          departure_time?: string
          arrival_time?: string
          available_seats?: number
          price?: number
          is_ecological?: boolean
          vehicle_brand?: string
          vehicle_model?: string
          vehicle_energy_type?: string
        }
      }
      reviews: {
        Row: {
          id: number
          created_at: string
          author_id: string
          driver_id: string
          ride_id: number
          rating: number
          comment: string
        }
        Insert: {
          id?: number
          created_at?: string
          author_id: string
          driver_id: string
          ride_id: number
          rating: number
          comment: string
        }
        Update: {
          id?: number
          created_at?: string
          author_id?: string
          driver_id?: string
          ride_id?: number
          rating?: number
          comment?: string
        }
      }
      bookings: {
        Row: {
          id: number
          created_at: string
          user_id: string
          ride_id: number
          status: 'pending' | 'confirmed' | 'cancelled'
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          ride_id: number
          status?: 'pending' | 'confirmed' | 'cancelled'
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          ride_id?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
        }
      }
    }
  }
}
