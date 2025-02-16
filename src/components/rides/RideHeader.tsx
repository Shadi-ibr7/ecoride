
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, MapPin, Users, Leaf } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Ride } from '@/types/ride';

type RideHeaderProps = {
  ride: Ride;
};

const RideHeader = ({ ride }: RideHeaderProps) => {
  return (
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
  );
};

export default RideHeader;
