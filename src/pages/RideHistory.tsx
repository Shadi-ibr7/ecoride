
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from 'react';
import { Ban } from 'lucide-react';

const RideHistory = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  // Récupérer tous les trajets où l'utilisateur est conducteur ou passager
  const { data: rides, isLoading } = useQuery({
    queryKey: ['rides-history', session?.user?.id],
    queryFn: async () => {
      // Récupérer les trajets en tant que conducteur
      const { data: driverRides, error: driverError } = await supabase
        .from('rides')
        .select(`
          *,
          vehicles (*),
          ride_bookings (
            id,
            passenger_id,
            booking_status,
            created_at,
            cancelled_at
          )
        `)
        .eq('driver_id', session?.user?.id);

      if (driverError) throw driverError;

      // Récupérer les trajets en tant que passager
      const { data: passengerRides, error: passengerError } = await supabase
        .from('ride_bookings')
        .select(`
          *,
          rides (
            *,
            vehicles (*),
            profiles:driver_id (
              full_name
            )
          )
        `)
        .eq('passenger_id', session?.user?.id);

      if (passengerError) throw passengerError;

      return {
        asDriver: driverRides || [],
        asPassenger: passengerRides || []
      };
    },
    enabled: !!session?.user?.id
  });

  // Mutation pour annuler un trajet
  const cancelRide = useMutation({
    mutationFn: async (rideId: string) => {
      // Si c'est un conducteur qui annule, on annule toutes les réservations
      const { data: isDriver } = await supabase
        .from('rides')
        .select('driver_id')
        .eq('id', rideId)
        .single();

      if (isDriver?.driver_id === session?.user?.id) {
        // Annuler toutes les réservations
        const { error } = await supabase
          .from('ride_bookings')
          .update({ booking_status: 'cancelled' })
          .eq('ride_id', rideId)
          .eq('booking_status', 'confirmed');

        if (error) throw error;
      } else {
        // Annuler uniquement sa propre réservation
        const { error } = await supabase
          .from('ride_bookings')
          .update({ booking_status: 'cancelled' })
          .eq('ride_id', rideId)
          .eq('passenger_id', session?.user?.id)
          .eq('booking_status', 'confirmed');

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides-history'] });
      toast.success('Le trajet a été annulé avec succès');
      setSelectedRideId(null);
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de l'annulation", {
        description: error.message
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8">
              Chargement de l'historique...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Trajets en tant que conducteur */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mes trajets en tant que conducteur</CardTitle>
            <CardDescription>
              Historique des trajets que vous avez proposés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rides?.asDriver.map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {ride.departure_address} → {ride.arrival_address}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Départ : {format(new Date(ride.departure_time), 'PPP à HH:mm', { locale: fr })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Véhicule : {ride.vehicles?.brand} {ride.vehicles?.model}
                        </p>
                        <p className="text-sm text-gray-600">
                          Places réservées : {ride.ride_bookings?.filter(b => b.booking_status === 'confirmed').length || 0}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setSelectedRideId(ride.id)}
                        disabled={new Date(ride.departure_time) < new Date()}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {rides?.asDriver.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  Vous n'avez pas encore proposé de trajets
                </p>
              )}
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
              {rides?.asPassenger.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {booking.rides.departure_address} → {booking.rides.arrival_address}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Départ : {format(new Date(booking.rides.departure_time), 'PPP à HH:mm', { locale: fr })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Conducteur : {booking.rides.profiles.full_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Véhicule : {booking.rides.vehicles?.brand} {booking.rides.vehicles?.model}
                        </p>
                        <p className={`text-sm ${booking.booking_status === 'cancelled' ? 'text-red-600' : 'text-green-600'}`}>
                          Statut : {booking.booking_status === 'cancelled' ? 'Annulé' : 'Confirmé'}
                        </p>
                      </div>
                      {booking.booking_status === 'confirmed' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setSelectedRideId(booking.rides.id)}
                          disabled={new Date(booking.rides.departure_time) < new Date()}
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {rides?.asPassenger.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  Vous n'avez pas encore participé à des trajets
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!selectedRideId} onOpenChange={() => setSelectedRideId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler ce trajet ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedRideId && cancelRide.mutate(selectedRideId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RideHistory;
