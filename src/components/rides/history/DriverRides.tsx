
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Ban } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';

type Ride = Database['public']['Tables']['rides']['Row'] & {
  ride_bookings: Database['public']['Tables']['ride_bookings']['Row'][]
};

interface DriverRidesProps {
  rides: Ride[];
  onCancelRide: (rideId: string) => void;
}

const DriverRides = ({ rides, onCancelRide }: DriverRidesProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Mes trajets en tant que conducteur</CardTitle>
        <CardDescription>
          Historique des trajets que vous avez proposés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rides.map(ride => (
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
                      onClick={() => onCancelRide(ride.id)}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {rides.length === 0 && (
            <p className="text-gray-600 text-center py-4">
              Vous n'avez pas encore proposé de trajets
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverRides;
