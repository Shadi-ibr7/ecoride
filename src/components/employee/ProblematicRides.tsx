
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertTriangle, MapPin, Clock, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProblematicRidesProps {
  rides: any[];
  isLoading: boolean;
}

const ProblematicRides = ({ rides, isLoading }: ProblematicRidesProps) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Chargement des trajets problématiques...</p>
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">Aucun trajet problématique signalé</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {rides.map((issue) => (
        <Card key={issue.id} className="bg-white shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-4 h-4" />
                Incident signalé
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold">
              Trajet #{issue.booking.ride.id}
            </CardTitle>
            <CardDescription>
              Signalement enregistré le {format(new Date(issue.created_at), 'PPP', { locale: fr })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-primary-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium">
                      {issue.booking.ride.departure_address} → {issue.booking.ride.arrival_address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-primary-600 mt-1 shrink-0" />
                  <div>
                    <p>Départ : {format(new Date(issue.booking.ride.departure_time), 'PPP à HH:mm', { locale: fr })}</p>
                    <p>Arrivée : {format(new Date(issue.booking.ride.arrival_time), 'PPP à HH:mm', { locale: fr })}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    <p className="font-medium">Conducteur</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="text-gray-600">Pseudo :</span>{' '}
                      {issue.booking.ride.driver.username}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Email :</span>{' '}
                      {issue.booking.ride.driver.auth_users?.[0]?.email}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    <p className="font-medium">Passager</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="text-gray-600">Pseudo :</span>{' '}
                      {issue.booking.passenger.username}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Email :</span>{' '}
                      {issue.booking.passenger.auth_users?.[0]?.email}
                    </p>
                  </div>
                </div>
              </div>

              {issue.comment && (
                <div className="pt-2">
                  <p className="font-medium mb-2">Description du problème</p>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{issue.comment}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProblematicRides;
