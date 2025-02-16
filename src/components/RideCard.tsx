
import { Star, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ride } from '@/types/ride';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RideCard = ({ ride }: { ride: Ride }) => {
  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-start gap-4">
        {/* Photo et infos conducteur */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src={ride.driver.photoUrl}
            alt={`Photo de ${ride.driver.name}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
          />
          <div className="text-center">
            <p className="font-medium text-primary-800">{ride.driver.name}</p>
            <div className="flex items-center justify-center text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm">{ride.driver.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Infos trajet */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold text-primary-800">
                {ride.departureCity} → {ride.arrivalCity}
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Départ : {format(new Date(ride.departureTime), 'PPP à HH:mm', { locale: fr })}</p>
                <p>Arrivée : {format(new Date(ride.arrivalTime), 'PPP à HH:mm', { locale: fr })}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary-600">{ride.price} €</p>
              <p className="text-sm text-gray-600">{ride.availableSeats} place{ride.availableSeats > 1 ? 's' : ''} disponible{ride.availableSeats > 1 ? 's' : ''}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {ride.isEcological && (
              <div className="flex items-center text-green-600 text-sm">
                <Leaf className="w-4 h-4 mr-1" />
                Voyage écologique
              </div>
            )}
            <Link
              to={`/rides/${ride.id}`}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Détail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCard;
