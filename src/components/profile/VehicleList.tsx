
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from 'lucide-react';

const VehicleList = () => {
  const { session } = useAuth();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner_id', session?.user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            Chargement...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            Aucun véhicule enregistré
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes véhicules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-start space-x-4 p-4 border rounded-lg"
            >
              <Car className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-500">
                  {vehicle.license_plate}
                </p>
                <p className="text-sm text-gray-500">
                  {vehicle.color} • {vehicle.energy_type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleList;
