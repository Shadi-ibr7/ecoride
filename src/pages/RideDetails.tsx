
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Star, Clock, MapPin, Users, Car, Leaf, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import type { Ride } from '@/types/ride';

const mockUser = {
  isLoggedIn: false,
  credits: 10
};

const mockRide: Ride = {
  id: 1,
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
  const ride = mockRide;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleParticipateClick = () => {
    if (!mockUser.isLoggedIn) {
      toast.error("Vous devez être connecté pour participer à un covoiturage", {
        description: "Veuillez vous connecter ou créer un compte.",
        action: {
          label: "Se connecter",
          onClick: () => {
            console.log("Redirection vers la page de connexion");
          },
        },
      });
      return;
    }

    if (mockUser.credits < ride.price) {
      toast.error("Crédit insuffisant", {
        description: `Vous avez ${mockUser.credits} crédits. Ce trajet en coûte ${ride.price}.`,
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

  const handleConfirmParticipation = () => {
    toast.success("Réservation confirmée !", {
      description: `Votre participation au trajet ${ride.departureCity} → ${ride.arrivalCity} a été enregistrée.`,
    });
    setShowConfirmDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary-800">
                    {ride.departureCity} → {ride.arrivalCity}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p>Départ : {format(new Date(ride.departureTime), 'PPP à HH:mm', { locale: fr })}</p>
                      <p>Arrivée : {format(new Date(ride.arrivalTime), 'PPP à HH:mm', { locale: fr })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{ride.departureCity} → {ride.arrivalCity}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span>{ride.availableSeats} place{ride.availableSeats > 1 ? 's' : ''} disponible{ride.availableSeats > 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-2xl font-bold text-primary-600">{ride.price} €</p>
                  </div>

                  {ride.isEcological && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Leaf className="w-5 h-5" />
                      <span>Voyage écologique</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Véhicule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Car className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{ride.vehicle.brand} {ride.vehicle.model}</p>
                      <p className="text-sm text-gray-600">Énergie : {ride.vehicle.energyType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Avis sur {ride.driver.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {ride.driver.reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.author}</span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(review.date), 'PP', { locale: fr })}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

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
                        disabled={ride.availableSeats <= 0}
                        className="px-6"
                      >
                        Participer
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
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <img
                      src={ride.driver.photoUrl}
                      alt={`Photo de ${ride.driver.name}`}
                      className="w-24 h-24 rounded-full object-cover border-2 border-primary-200"
                    />
                    <div>
                      <h3 className="text-xl font-medium">{ride.driver.name}</h3>
                      <div className="flex items-center justify-center text-yellow-500 mt-1">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="ml-1 text-lg">{ride.driver.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Préférences du conducteur</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ride.driver.preferences.map((preference, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-600">
                        <span>• {preference}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer votre participation</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de réserver une place pour le trajet
              {' '}{ride.departureCity} → {ride.arrivalCity}{' '}
              pour {ride.price} crédits.
              <br /><br />
              Date de départ : {format(new Date(ride.departureTime), 'PPP à HH:mm', { locale: fr })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmParticipation}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RideDetails;
