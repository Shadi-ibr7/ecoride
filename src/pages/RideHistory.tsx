
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { Ban } from 'lucide-react';

const RideHistory = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [rideToCancel, setRideToCancel] = useState<string | null>(null);

  // Récupérer tous les trajets où l'utilisateur est conducteur ou passager
  const { data: rides, isLoading } = useQuery({
    queryKey: ['rides-history', session?.user?.id],
    queryFn: async () => {
      // Récupérer les trajets en tant que conducteur
      const { data: driverRides, error: driverError } = await supabase
        .from('rides')
        .select(`
          *,
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
      const { error } = await supabase
        .from('rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides-history'] });
      toast.success('Trajet annulé avec succès');
      setRideToCancel(null);
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de l\'annulation', { description: error.message });
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
              {rides?.asDriver.map(ride => (
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
                          Places réservées : {ride.ride_bookings?.filter(b => b.booking_status === 'confirmed').length || 0}
                        </p>
                        <p className={`text-sm mt-2 ${ride.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'}`}>
                          Statut : {ride.status === 'cancelled' ? 'Annulé' : 'Actif'}
                        </p>
                      </div>
                      {ride.status !== 'cancelled' && new Date() < new Date(ride.departure_time) && (
                        <Button
                          variant="destructive"
                          onClick={() => setRideToCancel(ride.id)}
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                      )}
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
              {rides?.asPassenger.map(booking => (
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
                        <p className={`text-sm mt-2 ${booking.rides.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'}`}>
                          Statut : {booking.rides.status === 'cancelled' ? 'Annulé' : 'Actif'}
                        </p>
                      </div>
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

      <AlertDialog open={!!rideToCancel} onOpenChange={() => setRideToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler ce trajet ? Cette action est irréversible et les passagers seront notifiés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => rideToCancel && cancelRide.mutate(rideToCancel)}
              className="bg-red-600 hover:bg-red-700"
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
