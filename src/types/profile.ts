
export type UserType = 'passenger' | 'driver' | 'both';

export type Vehicle = {
  id: string;
  owner_id: string;
  license_plate: string;
  registration_date: string;
  brand: string;
  model: string;
  color: string;
  seats: number;
  created_at?: string;
};

export type DriverPreferences = {
  id: string;
  driver_id: string;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  created_at?: string;
};

export type CustomPreference = {
  id: string;
  driver_id: string;
  preference: string;
  created_at?: string;
};

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  user_type: UserType;
  created_at?: string;
}
