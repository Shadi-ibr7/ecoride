
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
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
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RideHeader from '@/components/rides/RideHeader';
import VehicleInfo from '@/components/rides/VehicleInfo';
import DriverReviews from '@/components/rides/DriverReviews';
import DriverProfile from '@/components/rides/DriverProfile';
import DriverPreferences from '@/components/rides/DriverPreferences';
import { useRideBooking } from '@/hooks/useRideBooking';
import { useAuth } from '@/hooks/useAuth';
import type { Ride } from '@/types/ride';

const RideDetails = () => {
  const { id } = useParams();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { session } = useAuth();
  const { bookRide } = useRideBooking();

  const { data: ride, isLoading, error } = useQuery({
    queryKey: ['ride', id],
    queryFn: async () => {
      const { data: rideData, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver:profiles!rides_driver_id_fkey (
            id,
            full_name,
            rating,
            photo_url,
            preferences
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform the data to match our Ride type
      const transformedRide: Ride = {
        id: rideData.id,
        driver: {
          id: rideData.driver.id,
          name: rideData.driver.full_name,
          rating: rideData.driver.rating || 4.5,
          photoUrl: rideData.driver.photo_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
          preferences: rideData.driver.preferences || ["Pas de fumée", "Conversation amicale", "Musique calme"],
          reviews: [] // We'll need to add an API endpoint to fetch reviews
        },
        vehicle: {
          brand: rideData.vehicle_brand || "Tesla",
          model: rideData.vehicle_model || "Model 3",
          energyType: rideData.vehicle_energy_type || "Électrique"
        },
        availableSeats: rideData.available_seats,
        price: rideData.price,
        departureCity: rideData.departure_address,
        arrivalCity: rideData.arrival_address,
        departureTime: rideData.departure_time,
        arrivalTime: rideData.arrival_time,
        isEcological: true
      };

      return transformedRide;
    },
    enabled: !!id
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error || !ride) {
    return <div>Une erreur est survenue lors du chargement du trajet.</div>;
  }

  const handleParticipateClick = () => {
    if (!session) {
      toast.error("Vous devez être connecté pour participer à un covoiturage", {
        description: "Veuillez vous connecter ou créer un compte.",
        action: {
          label: "Se connecter",
          onClick: () => {
            window.location.href = '/login';
          },
        },
      });
      return;
    }

    if (ride.availableSeats <= 0) {
      toast.error("Plus de places disponibles", {
        description: "Désolé, toutes les places ont été réservées.",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmParticipation = async () => {
    try {
      await bookRide.mutateAsync({
        rideId: ride.id,
        price: ride.price,
      });
      setShowConfirmDialog(false);
    } catch (error) {
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <RideHeader ride={ride} />
              <VehicleInfo vehicle={ride.vehicle} />
              <DriverReviews driver={ride.driver} />

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">{ride.price} crédits</p>
                        <p className="text-sm text-gray-600">
                          {ride.availableSeats} place{ride.availableSeats > 1 ? 's' : ''} disponible{ride.availableSeats > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        onClick={handleParticipateClick}
                        disabled={ride.availableSeats <= 0 || bookRide.isPending}
                        className="px-6"
                      >
                        {bookRide.isPending ? "En cours..." : "Participer"}
                      </Button>
                    </div>
                    {ride.availableSeats <= 0 && (
                      <div className="flex items-center text-yellow-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Plus aucune place disponible
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <DriverProfile driver={ride.driver} />
              <DriverPreferences preferences={ride.driver.preferences} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-[400px] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Confirmer votre participation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Vous êtes sur le point de réserver une place pour le trajet
              {' '}{ride.departureCity} → {ride.arrivalCity}{' '}
              pour {ride.price} crédits.
              <br /><br />
              Date de départ : {format(new Date(ride.departureTime), 'PPP à HH:mm', { locale: fr })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-sm">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmParticipation} className="text-sm">
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RideDetails;
