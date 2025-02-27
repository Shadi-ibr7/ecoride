
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export const useRideBooking = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const bookRide = useMutation({
    mutationFn: async ({ rideId, price }: { rideId: string; price: number }) => {
      if (!session?.user) {
        throw new Error('Vous devez être connecté pour réserver un trajet');
      }

      // Détection des trajets de démonstration (IDs commençant par "demo-")
      const isDemoRide = rideId.startsWith('demo-');
      
      if (isDemoRide) {
        // Pour les trajets de démo, on vérifie juste les crédits mais on ne fait pas de vraie réservation en base
        const { data: userCredits, error: creditsError } = await supabase
          .from('user_credits')
          .select('credits, id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (creditsError) throw creditsError;

        // Si aucun enregistrement de crédit n'existe
        if (!userCredits) {
          // Créer un enregistrement de crédits avec 0 crédits
          const { error: insertError } = await supabase
            .from('user_credits')
            .insert([
              { 
                user_id: session.user.id,
                credits: 0
              }
            ]);

          if (insertError) {
            console.error('Erreur lors de la création des crédits:', insertError);
            throw new Error('Crédit insuffisant. Vous avez 0 crédits, le trajet en coûte ' + price);
          }
          throw new Error('Crédit insuffisant. Vous avez 0 crédits, le trajet en coûte ' + price);
        }

        if (userCredits.credits < price) {
          throw new Error(`Crédit insuffisant. Vous avez ${userCredits.credits} crédits, le trajet en coûte ${price}`);
        }

        // Simuler une réservation réussie pour les trajets de démo
        // Déduire les crédits
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ credits: userCredits.credits - price })
          .eq('user_id', session.user.id);

        if (updateError) {
          console.error('Erreur lors de la mise à jour des crédits:', updateError);
          throw updateError;
        }

        // Retourner un objet de réservation simulé
        return {
          id: `demo-booking-${Date.now()}`,
          ride_id: rideId,
          passenger_id: session.user.id,
          booking_status: 'confirmed',
          created_at: new Date().toISOString()
        };
      }

      // Code original pour les vrais trajets (non-démo)
      // 1. Vérifier les crédits de l'utilisateur
      const { data: userCredits, error: creditsError } = await supabase
        .from('user_credits')
        .select('credits, id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (creditsError) throw creditsError;

      // Si aucun enregistrement de crédit n'existe
      if (!userCredits) {
        // Créer un enregistrement de crédits avec 0 crédits
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert([
            { 
              user_id: session.user.id,
              credits: 0
            }
          ]);

        if (insertError) {
          console.error('Erreur lors de la création des crédits:', insertError);
          throw new Error('Crédit insuffisant. Vous avez 0 crédits, le trajet en coûte ' + price);
        }
        throw new Error('Crédit insuffisant. Vous avez 0 crédits, le trajet en coûte ' + price);
      }

      if (userCredits.credits < price) {
        throw new Error(`Crédit insuffisant. Vous avez ${userCredits.credits} crédits, le trajet en coûte ${price}`);
      }

      // 2. Créer la réservation
      const { data: booking, error: bookingError } = await supabase
        .from('ride_bookings')
        .insert([{
          ride_id: rideId,
          passenger_id: session.user.id,
          booking_status: 'confirmed'
        }])
        .select()
        .single();

      if (bookingError) {
        console.error('Erreur lors de la réservation:', bookingError);
        throw bookingError;
      }

      // 3. Mettre à jour les crédits de l'utilisateur
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits: userCredits.credits - price })
        .eq('user_id', session.user.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour des crédits:', updateError);
        // Annuler la réservation si la mise à jour des crédits échoue
        await supabase
          .from('ride_bookings')
          .delete()
          .eq('id', booking.id);
        throw updateError;
      }

      return booking;
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
