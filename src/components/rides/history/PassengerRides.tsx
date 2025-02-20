
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from '@/integrations/supabase/types';

type RideBooking = Database['public']['Tables']['ride_bookings']['Row'] & {
  rides: Database['public']['Tables']['rides']['Row'] & {
    profiles: {
      full_name: string;
    };
  };
};

interface PassengerRidesProps {
  bookings: RideBooking[];
}

const PassengerRides = ({ bookings }: PassengerRidesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes trajets en tant que passager</CardTitle>
        <CardDescription>
          Historique des trajets auxquels vous participez
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map(booking => (
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
          {bookings.length === 0 && (
            <p className="text-gray-600 text-center py-4">
              Vous n'avez pas encore participé à des trajets
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PassengerRides;
