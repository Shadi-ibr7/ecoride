
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Profile, Vehicle, DriverPreferences, CustomPreference } from '@/types/profile';
import { toast } from 'sonner';

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isError: isProfileError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // Si le profil n'existe pas, créons-le
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            user_type: 'passenger'
          })
          .select('*')
          .single();

        if (createError) throw createError;
        return newProfile as Profile;
      }

      return data as Profile;
    },
  });

  const { data: vehicles, isError: isVehiclesError } = useQuery({
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
    enabled: !isProfileError,
  });

  const { data: preferences, isError: isPreferencesError } = useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data: driverPrefs, error: driverError } = await supabase
        .from('driver_preferences')
        .select('*')
        .eq('driver_id', user.id)
        .maybeSingle();

      if (driverError && driverError.code !== 'PGRST116') {
        throw driverError;
      }

      const { data: customPrefs, error: customError } = await supabase
        .from('custom_preferences')
        .select('*')
        .eq('driver_id', user.id);

      if (customError) throw customError;

      return {
        driver: driverPrefs as DriverPreferences | null,
        custom: customPrefs as CustomPreference[],
      };
    },
    enabled: !isProfileError && !isVehiclesError,
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
