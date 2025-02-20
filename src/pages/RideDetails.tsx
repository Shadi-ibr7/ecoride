import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const mockRide: Ride = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  driver: {
    id: 1,
    name: "Marie L.",
    rating: 4.8,
    photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    preferences: ["Pas de fumée", "Conversation amicale", "Musique calme"],
    reviews: [
      {
        id: 1,
        author: "Thomas R.",
        rating: 5,
        comment: "Excellent voyage, Marie est une conductrice très agréable et prudente.",
        date: "2024-03-15"
      },
      {
        id: 2,
        author: "Sophie M.",
        rating: 4.5,
        comment: "Très bon trajet, ponctuelle et sympathique.",
        date: "2024-03-10"
      }
    ]
  },
  vehicle: {
    brand: "Tesla",
    model: "Model 3",
    energyType: "Électrique"
  },
  availableSeats: 3,
  price: 15,
  departureCity: "Lyon",
  arrivalCity: "Paris",
  departureTime: "2024-04-15T08:00:00",
  arrivalTime: "2024-04-15T13:00:00",
  isEcological: true
};

const RideDetails = () => {
  const { id } = useParams();
  const ride = id ? { ...mockRide, id } : mockRide;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { session } = useAuth();
  const { bookRide } = useRideBooking();

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
