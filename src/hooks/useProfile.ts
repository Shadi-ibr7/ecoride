
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*, auth_users(email)')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      // Log pour debug
      console.log('Profile fetched:', data);
      
      return data as Profile;
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      if (!userId) throw new Error('User ID is required');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast.success("Profil mis à jour avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du profil", {
        description: error.message
      });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile,
  };
};
