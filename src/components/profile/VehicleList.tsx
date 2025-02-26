
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const VehicleList = () => {
  const { session } = useAuth();

  const { data: vehicles, isLoading, error } = useQuery({
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

  if (error) {
    console.error('Error fetching vehicles:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">
            Une erreur est survenue lors du chargement des véhicules
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
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
        <div className="divide-y divide-gray-200">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">
                    {vehicle.brand} {vehicle.model}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {vehicle.license_plate} • {vehicle.color} • {vehicle.energy_type}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {vehicle.seats} places
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleList;
