
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trajets problématiques</CardTitle>
        <CardDescription>
          Liste des trajets signalés comme problématiques par les utilisateurs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Chargement des trajets problématiques...</p>
          ) : rides?.length === 0 ? (
            <p className="text-gray-500">Aucun trajet problématique signalé</p>
          ) : (
            rides?.map((issue) => (
              <Card key={issue.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="destructive" className="mb-2">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Problème signalé
                      </Badge>
                      <h3 className="font-semibold">
                        Trajet #{issue.booking.ride.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {issue.booking.ride.departure_address} → {issue.booking.ride.arrival_address}
                      </p>
                      <p className="text-sm text-gray-600">
                        Le {format(new Date(issue.booking.ride.departure_time), 'PPP', { locale: fr })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Conducteur</h4>
                      <p className="text-sm">
                        Pseudo : {issue.booking.ride.driver.username}
                      </p>
                      <p className="text-sm">
                        Email : {issue.booking.ride.driver.auth_users?.[0]?.email}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Passager</h4>
                      <p className="text-sm">
                        Pseudo : {issue.booking.passenger.username}
                      </p>
                      <p className="text-sm">
                        Email : {issue.booking.passenger.auth_users?.[0]?.email}
                      </p>
                    </div>
                  </div>

                  {issue.comment && (
                    <div>
                      <h4 className="font-medium mb-2">Description du problème</h4>
                      <p className="text-sm text-gray-700">{issue.comment}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblematicRides;
