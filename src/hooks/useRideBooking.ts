
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export const useRideBooking = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const bookRide = useMutation({
    mutationFn: async ({ rideId, price }: { rideId: number; price: number }) => {
      if (!session?.user) {
        throw new Error('Vous devez être connecté pour réserver un trajet');
      }

      // 1. Vérifier les crédits de l'utilisateur
      const { data: userCredits, error: creditsError } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (creditsError) throw creditsError;

      // Si aucun enregistrement de crédit n'existe, on en crée un avec 0 crédits
      if (!userCredits) {
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert([{ user_id: session.user.id, credits: 0 }]);
        
        if (insertError) throw insertError;
        throw new Error('Crédit insuffisant. Vous avez 0 crédits, le trajet en coûte ' + price);
      }

      if (userCredits.credits < price) {
        throw new Error(`Crédit insuffisant. Vous avez ${userCredits.credits} crédits, le trajet en coûte ${price}.`);
      }

      // 2. Créer la réservation et mettre à jour les crédits
      const { error: bookingError } = await supabase.from('ride_bookings').insert({
        ride_id: rideId,
        passenger_id: session.user.id,
      });

      if (bookingError) throw bookingError;

      // 3. Mettre à jour les crédits de l'utilisateur
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits: userCredits.credits - price })
        .eq('user_id', session.user.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      toast.success('Réservation confirmée !');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la réservation', {
        description: error.message
      });
    },
  });

  return { bookRide };
};
