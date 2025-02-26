
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VehicleForm from './VehicleForm';
import VehicleList from './VehicleList';
import RideInformationForm from '@/components/rides/create/RideInformationForm';
import PriceAndSeatsForm from '@/components/rides/create/PriceAndSeatsForm';
import VehicleFormRide from '@/components/rides/create/VehicleForm';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

const VehicleManagement = () => {
  const { session } = useAuth();
  const [showRideForm, setShowRideForm] = useState(false);
  const [price, setPrice] = useState<number>(2);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);

  const { data: vehicles } = useQuery({
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

  return (
    <div className="space-y-6">
      <VehicleList />
      <VehicleForm />

      <Card>
        <CardHeader>
          <CardTitle>Gestion des trajets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={() => setShowRideForm(!showRideForm)}
              variant="outline"
              className="w-full"
            >
              {showRideForm ? "Masquer le formulaire" : "Créer un nouveau trajet"}
            </Button>

            {showRideForm && (
              <form className="space-y-6">
                <RideInformationForm />
                <PriceAndSeatsForm price={price} onPriceChange={setPrice} />
                <VehicleFormRide 
                  vehicles={vehicles}
                  selectedVehicle={selectedVehicle}
                  onVehicleSelect={setSelectedVehicle}
                  showNewVehicleForm={showNewVehicleForm}
                  onToggleNewVehicleForm={() => setShowNewVehicleForm(!showNewVehicleForm)}
                />
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleManagement;
