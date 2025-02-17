
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Profile, Vehicle, DriverPreferences, CustomPreference } from '@/types/profile';
import { toast } from 'sonner';

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;
      return data as Vehicle[];
    },
  });

  const { data: preferences } = useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data: driverPrefs, error: driverError } = await supabase
        .from('driver_preferences')
        .select('*')
        .eq('driver_id', user.id)
        .single();

      if (driverError && driverError.code !== 'PGRST116') throw driverError;

      const { data: customPrefs, error: customError } = await supabase
        .from('custom_preferences')
        .select('*')
        .eq('driver_id', user.id);

      if (customError) throw customError;

      return {
        driver: driverPrefs as DriverPreferences,
        custom: customPrefs as CustomPreference[],
      };
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profil mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la mise à jour du profil", {
        description: error.message
      });
    },
  });

  const addVehicle = useMutation({
    mutationFn: async (vehicle: Omit<Vehicle, 'id' | 'owner_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('vehicles')
        .insert({ ...vehicle, owner_id: user.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Véhicule ajouté avec succès');
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de l'ajout du véhicule", {
        description: error.message
      });
    },
  });

  const updatePreferences = useMutation({
    mutationFn: async ({ 
      driverPrefs,
      customPrefs 
    }: { 
      driverPrefs: Omit<DriverPreferences, 'id' | 'created_at'>,
      customPrefs: Omit<CustomPreference, 'id' | 'created_at'>[]
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { error: driverError } = await supabase
        .from('driver_preferences')
        .upsert({ ...driverPrefs, driver_id: user.id });

      if (driverError) throw driverError;

      // Supprimer les anciennes préférences personnalisées
      const { error: deleteError } = await supabase
        .from('custom_preferences')
        .delete()
        .eq('driver_id', user.id);

      if (deleteError) throw deleteError;

      // Ajouter les nouvelles préférences personnalisées
      if (customPrefs.length > 0) {
        const { error: insertError } = await supabase
          .from('custom_preferences')
          .insert(customPrefs.map(pref => ({ ...pref, driver_id: user.id })));

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      toast.success('Préférences mises à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la mise à jour des préférences", {
        description: error.message
      });
    },
  });

  return {
    profile,
    vehicles,
    preferences,
    updateProfile,
    addVehicle,
    updatePreferences,
  };
};
