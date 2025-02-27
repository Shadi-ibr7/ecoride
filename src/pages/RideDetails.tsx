
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

  // Récupération des trajets de démonstration si l'ID commence par "demo-"
  const isDemoRide = id?.startsWith('demo-');

  const { data: ride, isLoading, error } = useQuery({
    queryKey: ['ride', id],
    queryFn: async () => {
      // Si c'est un trajet de démonstration, retourner des données statiques
      if (isDemoRide) {
        // Trajets de démonstration correspondant à ceux définis dans Rides.tsx
        const demoRides = {
          'demo-1': {
            id: "demo-1",
            departureCity: "Paris",
            arrivalCity: "Lyon",
            departureTime: new Date(Date.now() + 86400000).toISOString(),
            arrivalTime: new Date(Date.now() + 86400000 + 10800000).toISOString(),
            price: 25,
            availableSeats: 3,
            driver: {
              id: 101,
              name: "Thomas Martin",
              rating: 4.7,
              photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
              preferences: ["Calme", "Musique"],
              reviews: []
            },
            vehicle: {
              brand: "Renault",
              model: "Zoe",
              energyType: "Électrique"
            },
            isEcological: true
          },
          'demo-2': {
            id: "demo-2",
            departureCity: "Marseille",
            arrivalCity: "Nice",
            departureTime: new Date(Date.now() + 172800000).toISOString(),
            arrivalTime: new Date(Date.now() + 172800000 + 7200000).toISOString(),
            price: 15,
            availableSeats: 2,
            driver: {
              id: 102,
              name: "Sophie Dubois",
              rating: 4.9,
              photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
              preferences: ["Discussion", "Musique"],
              reviews: []
            },
            vehicle: {
              brand: "Toyota",
              model: "Prius",
              energyType: "Hybride"
            },
            isEcological: true
          },
          'demo-3': {
            id: "demo-3",
            departureCity: "Bordeaux",
            arrivalCity: "Toulouse",
            departureTime: new Date(Date.now() + 259200000).toISOString(),
            arrivalTime: new Date(Date.now() + 259200000 + 7200000).toISOString(),
            price: 18,
            availableSeats: 4,
            driver: {
              id: 103,
              name: "Pierre Leroy",
              rating: 4.5,
              photoUrl: "https://randomuser.me/api/portraits/men/67.jpg",
              preferences: ["Non-fumeur", "Animaux acceptés"],
              reviews: []
            },
            vehicle: {
              brand: "Volkswagen",
              model: "ID.4",
              energyType: "Électrique"
            },
            isEcological: true
          }
        };
        
        // @ts-ignore - Nous savons que l'ID est valide
        return demoRides[id] as Ride;
      }

      // Sinon, récupérer les données depuis Supabase
      try {
        const { data: rideData, error } = await supabase
          .from('rides')
          .select(`
            *,
            driver:profiles(id, full_name, rating, photo_url, preferences)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!rideData) throw new Error("Trajet non trouvé");

        // Transformer les données pour correspondre à notre type Ride
        const transformedRide: Ride = {
          id: rideData.id,
          driver: {
            id: rideData.driver?.id || 0,
            name: rideData.driver?.full_name || "Conducteur inconnu",
            rating: rideData.driver?.rating || 4.5,
            photoUrl: rideData.driver?.photo_url || "https://randomuser.me/api/portraits/lego/1.jpg",
            preferences: rideData.driver?.preferences || ["Pas de préférences spécifiées"],
            reviews: []
          },
          vehicle: {
            brand: rideData.vehicle_brand || "Non spécifié",
            model: rideData.vehicle_model || "Non spécifié",
            energyType: rideData.vehicle_energy_type || "Essence"
          },
          availableSeats: rideData.available_seats,
          price: rideData.price,
          departureCity: rideData.departure_address,
          arrivalCity: rideData.arrival_address,
          departureTime: rideData.departure_time,
          arrivalTime: rideData.arrival_time,
          isEcological: rideData.vehicle_energy_type === "Électrique"
        };

        return transformedRide;
      } catch (error) {
        console.error("Erreur lors du chargement du trajet:", error);
        throw error;
      }
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Une erreur est survenue lors du chargement du trajet</h1>
              <p className="text-gray-600 mb-6">Nous n'avons pas pu récupérer les informations pour ce trajet.</p>
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
              >
                Retour aux trajets
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
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
                        <p className="text-2xl font-bold text-primary-600">{ride.price} €</p>
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
              pour {ride.price} €.
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
