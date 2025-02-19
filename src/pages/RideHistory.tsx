import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import RideValidationDialog from '@/components/rides/RideValidationDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from 'react';
import { Ban, Play, CheckCircle2 } from 'lucide-react';
const RideHistory = () => {
  const {
    session
  } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [rideToValidate, setRideToValidate] = useState<{
    rideId: string;
    bookingId: string;
  } | null>(null);

  // Récupérer tous les trajets où l'utilisateur est conducteur ou passager
  const {
    data: rides,
    isLoading
  } = useQuery({
    queryKey: ['rides-history', session?.user?.id],
    queryFn: async () => {
      // Récupérer les trajets en tant que conducteur
      const {
        data: driverRides,
        error: driverError
      } = await supabase.from('rides').select(`
          *,
          vehicles (*),
          ride_bookings (
            id,
            passenger_id,
            booking_status,
            created_at,
            cancelled_at,
            ride_validations (*)
          )
        `).eq('driver_id', session?.user?.id);
      if (driverError) throw driverError;

      // Récupérer les trajets en tant que passager
      const {
        data: passengerRides,
        error: passengerError
      } = await supabase.from('ride_bookings').select(`
          *,
          ride_validations (*),
          rides (
            *,
            vehicles (*),
            profiles:driver_id (
              full_name
            )
          )
        `).eq('passenger_id', session?.user?.id);
      if (passengerError) throw passengerError;
      return {
        asDriver: driverRides || [],
        asPassenger: passengerRides || []
      };
    },
    enabled: !!session?.user?.id
  });

  // Mutation pour démarrer un trajet
  const startRide = useMutation({
    mutationFn: async (rideId: string) => {
      const {
        error
      } = await supabase.from('rides').update({
        status: 'in_progress'
      }).eq('id', rideId).eq('driver_id', session?.user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rides-history']
      });
      toast.success('Le trajet a démarré');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors du démarrage du trajet', {
        description: error.message
      });
    }
  });

  // Mutation pour terminer un trajet
  const completeRide = useMutation({
    mutationFn: async (rideId: string) => {
      const {
        error
      } = await supabase.from('rides').update({
        status: 'completed',
        completed_at: new Date().toISOString()
      }).eq('id', rideId).eq('driver_id', session?.user?.id);
      if (error) throw error;

      // Notifier les passagers
      await supabase.functions.invoke('notify-ride-completion', {
        body: {
          rideId
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rides-history']
      });
      toast.success('Le trajet est terminé');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la fin du trajet', {
        description: error.message
      });
    }
  });

  // Mutation pour soumettre une validation
  const submitValidation = useMutation({
    mutationFn: async ({
      bookingId,
      isValidated,
      comment,
      rating
    }: {
      bookingId: string;
      isValidated: boolean;
      comment?: string;
      rating?: number;
    }) => {
      const {
        error
      } = await supabase.from('ride_validations').insert({
        booking_id: bookingId,
        is_validated: isValidated,
        comment,
        rating: isValidated ? rating : null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rides-history']
      });
      toast.success('Merci pour votre retour !');
      setRideToValidate(null);
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la validation', {
        description: error.message
      });
    }
  });
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8">
              Chargement de l'historique...
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Trajets en tant que conducteur */}
        <Card className="mb-7 px-px py-0">
          <CardHeader className="my-[90px] px-0">
            <CardTitle>Mes trajets en tant que conducteur</CardTitle>
            <CardDescription>
              Historique des trajets que vous avez proposés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rides?.asDriver.map(ride => <Card key={ride.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {ride.departure_address} → {ride.arrival_address}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Départ : {format(new Date(ride.departure_time), 'PPP à HH:mm', {
                        locale: fr
                      })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Véhicule : {ride.vehicles?.brand} {ride.vehicles?.model}
                        </p>
                        <p className="text-sm text-gray-600">
                          Places réservées : {ride.ride_bookings?.filter(b => b.booking_status === 'confirmed').length || 0}
                        </p>
                        <p className={`text-sm mt-2 ${ride.status === 'completed' ? 'text-green-600' : ride.status === 'in_progress' ? 'text-blue-600' : 'text-gray-600'}`}>
                          Statut : {ride.status === 'completed' ? 'Terminé' : ride.status === 'in_progress' ? 'En cours' : 'En attente'}
                        </p>
                      </div>
                      <div className="space-x-2">
                        {ride.status === 'pending' && <Button onClick={() => startRide.mutate(ride.id)} disabled={startRide.isPending || new Date() > new Date(ride.departure_time)}>
                            <Play className="w-4 h-4 mr-2" />
                            Démarrer
                          </Button>}
                        {ride.status === 'in_progress' && <Button onClick={() => completeRide.mutate(ride.id)} disabled={completeRide.isPending}>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Arrivé à destination
                          </Button>}
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
              {rides?.asDriver.length === 0 && <p className="text-gray-600 text-center py-4">
                  Vous n'avez pas encore proposé de trajets
                </p>}
            </div>
          </CardContent>
        </Card>

        {/* Trajets en tant que passager */}
        <Card>
          <CardHeader>
            <CardTitle>Mes trajets en tant que passager</CardTitle>
            <CardDescription>
              Historique des trajets auxquels vous participez
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rides?.asPassenger.map(booking => <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {booking.rides.departure_address} → {booking.rides.arrival_address}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Départ : {format(new Date(booking.rides.departure_time), 'PPP à HH:mm', {
                        locale: fr
                      })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Conducteur : {booking.rides.profiles.full_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Véhicule : {booking.rides.vehicles?.brand} {booking.rides.vehicles?.model}
                        </p>
                        <p className={`text-sm ${booking.rides.status === 'completed' ? 'text-green-600' : booking.rides.status === 'in_progress' ? 'text-blue-600' : 'text-gray-600'}`}>
                          Statut : {booking.rides.status === 'completed' ? 'Terminé' : booking.rides.status === 'in_progress' ? 'En cours' : 'En attente'}
                        </p>
                      </div>
                      {booking.rides.status === 'completed' && !booking.ride_validations?.[0] && <Button onClick={() => setRideToValidate({
                    rideId: booking.rides.id,
                    bookingId: booking.id
                  })}>
                          Valider le trajet
                        </Button>}
                    </div>
                  </CardContent>
                </Card>)}
              {rides?.asPassenger.length === 0 && <p className="text-gray-600 text-center py-4">
                  Vous n'avez pas encore participé à des trajets
                </p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <RideValidationDialog open={!!rideToValidate} onOpenChange={open => !open && setRideToValidate(null)} onSubmit={data => {
      if (rideToValidate) {
        submitValidation.mutate({
          bookingId: rideToValidate.bookingId,
          ...data
        });
      }
    }} isSubmitting={submitValidation.isPending} />
    </div>;
};
export default RideHistory;