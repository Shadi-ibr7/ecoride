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
      avis: {
        Row: {
          avis_id: number
          commentaire: string | null
          note: string | null
          statut: string | null
        }
        Insert: {
          avis_id?: number
          commentaire?: string | null
          note?: string | null
          statut?: string | null
        }
        Update: {
          avis_id?: number
          commentaire?: string | null
          note?: string | null
          statut?: string | null
        }
        Relationships: []
      }
      configuration: {
        Row: {
          id_configuration: number
          parametre: number | null
        }
        Insert: {
          id_configuration?: number
          parametre?: number | null
        }
        Update: {
          id_configuration?: number
          parametre?: number | null
        }
        Relationships: []
      }
      covoiturage: {
        Row: {
          covoiturage_id: number
          date_arrivee: string | null
          date_depart: string | null
          heure_arrivee: string | null
          heure_depart: string | null
          lieu_arrivee: string | null
          lieu_depart: string | null
          nb_place: number | null
          prix_personne: number | null
          statut: string | null
        }
        Insert: {
          covoiturage_id?: number
          date_arrivee?: string | null
          date_depart?: string | null
          heure_arrivee?: string | null
          heure_depart?: string | null
          lieu_arrivee?: string | null
          lieu_depart?: string | null
          nb_place?: number | null
          prix_personne?: number | null
          statut?: string | null
        }
        Update: {
          covoiturage_id?: number
          date_arrivee?: string | null
          date_depart?: string | null
          heure_arrivee?: string | null
          heure_depart?: string | null
          lieu_arrivee?: string | null
          lieu_depart?: string | null
          nb_place?: number | null
          prix_personne?: number | null
          statut?: string | null
        }
        Relationships: []
      }
      depose: {
        Row: {
          avis_id: number
          utilisateur_id: number
        }
        Insert: {
          avis_id: number
          utilisateur_id: number
        }
        Update: {
          avis_id?: number
          utilisateur_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "depose_avis_id_fkey"
            columns: ["avis_id"]
            isOneToOne: false
            referencedRelation: "avis"
            referencedColumns: ["avis_id"]
          },
          {
            foreignKeyName: "depose_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["utilisateur_id"]
          },
        ]
      }
      dispose: {
        Row: {
          configuration_id: number
          parametre_id: number
        }
        Insert: {
          configuration_id: number
          parametre_id: number
        }
        Update: {
          configuration_id?: number
          parametre_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "dispose_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "configuration"
            referencedColumns: ["id_configuration"]
          },
          {
            foreignKeyName: "dispose_parametre_id_fkey"
            columns: ["parametre_id"]
            isOneToOne: false
            referencedRelation: "parametre"
            referencedColumns: ["parametre_id"]
          },
        ]
      }
      gere: {
        Row: {
          utilisateur_id: number
          voiture_id: number
        }
        Insert: {
          utilisateur_id: number
          voiture_id: number
        }
        Update: {
          utilisateur_id?: number
          voiture_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gere_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["utilisateur_id"]
          },
          {
            foreignKeyName: "gere_voiture_id_fkey"
            columns: ["voiture_id"]
            isOneToOne: false
            referencedRelation: "voiture"
            referencedColumns: ["voiture_id"]
          },
        ]
      }
      marque: {
        Row: {
          libelle: string | null
          marque_id: number
        }
        Insert: {
          libelle?: string | null
          marque_id?: number
        }
        Update: {
          libelle?: string | null
          marque_id?: number
        }
        Relationships: []
      }
      parametre: {
        Row: {
          parametre_id: number
          propriete: string | null
          valeur: string | null
        }
        Insert: {
          parametre_id?: number
          propriete?: string | null
          valeur?: string | null
        }
        Update: {
          parametre_id?: number
          propriete?: string | null
          valeur?: string | null
        }
        Relationships: []
      }
      participe: {
        Row: {
          covoiturage_id: number
          utilisateur_id: number
        }
        Insert: {
          covoiturage_id: number
          utilisateur_id: number
        }
        Update: {
          covoiturage_id?: number
          utilisateur_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "participe_covoiturage_id_fkey"
            columns: ["covoiturage_id"]
            isOneToOne: false
            referencedRelation: "covoiturage"
            referencedColumns: ["covoiturage_id"]
          },
          {
            foreignKeyName: "participe_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["utilisateur_id"]
          },
        ]
      }
      platform_earnings: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      possede: {
        Row: {
          role_id: number
          utilisateur_id: number
        }
        Insert: {
          role_id: number
          utilisateur_id: number
        }
        Update: {
          role_id?: number
          utilisateur_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "possede_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "possede_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["utilisateur_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_suspended: boolean | null
          user_type: Database["public"]["Enums"]["user_type"] | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          is_suspended?: boolean | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_suspended?: boolean | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
        }
        Relationships: []
      }
      rides: {
        Row: {
          arrival_address: string
          arrival_time: string
          available_seats: number
          created_at: string | null
          departure_address: string
          departure_time: string
          driver_id: string | null
          id: string
          is_cancelled: boolean | null
          price: number
          updated_at: string | null
        }
        Insert: {
          arrival_address: string
          arrival_time: string
          available_seats: number
          created_at?: string | null
          departure_address: string
          departure_time: string
          driver_id?: string | null
          id?: string
          is_cancelled?: boolean | null
          price: number
          updated_at?: string | null
        }
        Update: {
          arrival_address?: string
          arrival_time?: string
          available_seats?: number
          created_at?: string | null
          departure_address?: string
          departure_time?: string
          driver_id?: string | null
          id?: string
          is_cancelled?: boolean | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      role: {
        Row: {
          libelle: string | null
          role_id: number
        }
        Insert: {
          libelle?: string | null
          role_id?: number
        }
        Update: {
          libelle?: string | null
          role_id?: number
        }
        Relationships: []
      }
      utilisateur: {
        Row: {
          adresse: string | null
          date_naissance: string | null
          email: string | null
          nom: string | null
          password: string | null
          photo: string | null
          prenom: string | null
          pseudo: string | null
          telephone: string | null
          utilisateur_id: number
        }
        Insert: {
          adresse?: string | null
          date_naissance?: string | null
          email?: string | null
          nom?: string | null
          password?: string | null
          photo?: string | null
          prenom?: string | null
          pseudo?: string | null
          telephone?: string | null
          utilisateur_id?: number
        }
        Update: {
          adresse?: string | null
          date_naissance?: string | null
          email?: string | null
          nom?: string | null
          password?: string | null
          photo?: string | null
          prenom?: string | null
          pseudo?: string | null
          telephone?: string | null
          utilisateur_id?: number
        }
        Relationships: []
      }
      utilise: {
        Row: {
          covoiturage_id: number
          voiture_id: number
        }
        Insert: {
          covoiturage_id: number
          voiture_id: number
        }
        Update: {
          covoiturage_id?: number
          voiture_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "utilise_covoiturage_id_fkey"
            columns: ["covoiturage_id"]
            isOneToOne: false
            referencedRelation: "covoiturage"
            referencedColumns: ["covoiturage_id"]
          },
          {
            foreignKeyName: "utilise_voiture_id_fkey"
            columns: ["voiture_id"]
            isOneToOne: false
            referencedRelation: "voiture"
            referencedColumns: ["voiture_id"]
          },
        ]
      }
      voiture: {
        Row: {
          couleur: string | null
          date_premiere_immatriculation: string | null
          energie: string | null
          immatriculation: string | null
          marque_id: number | null
          modele: string | null
          voiture_id: number
        }
        Insert: {
          couleur?: string | null
          date_premiere_immatriculation?: string | null
          energie?: string | null
          immatriculation?: string | null
          marque_id?: number | null
          modele?: string | null
          voiture_id?: number
        }
        Update: {
          couleur?: string | null
          date_premiere_immatriculation?: string | null
          energie?: string | null
          immatriculation?: string | null
          marque_id?: number | null
          modele?: string | null
          voiture_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "voiture_marque_id_fkey"
            columns: ["marque_id"]
            isOneToOne: false
            referencedRelation: "marque"
            referencedColumns: ["marque_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_employee_account: {
        Args: {
          email: string
          password: string
          username: string
          full_name: string
        }
        Returns: string
      }
      set_admin_user_type: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_type: "passenger" | "driver" | "both" | "admin" | "employee"
      user_type_new: "passenger" | "driver" | "both" | "employee" | "admin"
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
