import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import RideInformationForm from '@/components/rides/create/RideInformationForm';
import PriceAndSeatsForm from '@/components/rides/create/PriceAndSeatsForm';
import VehicleForm from '@/components/rides/create/VehicleForm';

const CreateRide = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
  const [price, setPrice] = useState<number>(2);

  // Récupérer les véhicules de l'utilisateur
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
    enabled: !!session?.user?.id,
  });

  // Vérifier si l'utilisateur est un chauffeur
  const { data: userProfile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Mutation pour créer un nouveau véhicule
  const createVehicle = useMutation({
    mutationFn: async (vehicleData: any) => {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{ ...vehicleData, owner_id: session?.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('Véhicule ajouté avec succès');
      setSelectedVehicle(data.id);
      setShowNewVehicleForm(false);
    },
  });

  // Mutation pour créer un nouveau trajet
  const createRide = useMutation({
    mutationFn: async (rideData: any) => {
      const { error } = await supabase
        .from('rides')
        .insert([{ ...rideData, driver_id: session?.user?.id }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Trajet créé avec succès');
      navigate('/mes-trajets');
    },
  });

  // Vérifier si l'utilisateur n'est pas un chauffeur
  if (userProfile && userProfile.user_type !== 'driver' && userProfile.user_type !== 'both') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Accès non autorisé</CardTitle>
              <CardDescription>
                Vous devez être chauffeur pour proposer des trajets.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (showNewVehicleForm) {
      await createVehicle.mutateAsync({
        brand: formData.get('brand'),
        model: formData.get('model'),
        license_plate: formData.get('license_plate'),
        color: formData.get('color'),
        seats: Number(formData.get('seats')),
        energy_type: formData.get('energy_type')
      });
    }

    const requestedPrice = Number(formData.get('price'));
    if (requestedPrice < 2) {
      toast.error('Le prix minimum est de 2 crédits (frais de plateforme)');
      return;
    }

    await createRide.mutateAsync({
      vehicle_id: selectedVehicle,
      departure_address: formData.get('departure'),
      arrival_address: formData.get('arrival'),
      departure_time: formData.get('departure_time'),
      arrival_time: formData.get('arrival_time'),
      price: requestedPrice,
      available_seats: Number(formData.get('available_seats')),
      vehicle_brand: formData.get('brand') || vehicles?.find(v => v.id === selectedVehicle)?.brand,
      vehicle_model: formData.get('model') || vehicles?.find(v => v.id === selectedVehicle)?.model,
      vehicle_energy_type: formData.get('energy_type') || vehicles?.find(v => v.id === selectedVehicle)?.energy_type
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Proposer un trajet</CardTitle>
            <CardDescription>
              Remplissez les informations ci-dessous pour proposer un nouveau trajet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <RideInformationForm />
              <PriceAndSeatsForm 
                price={price}
                onPriceChange={setPrice}
              />
              <VehicleForm
                vehicles={vehicles}
                selectedVehicle={selectedVehicle}
                onVehicleSelect={setSelectedVehicle}
                showNewVehicleForm={showNewVehicleForm}
                onToggleNewVehicleForm={() => {
                  setShowNewVehicleForm(!showNewVehicleForm);
                  setSelectedVehicle(null);
                }}
              />
              <Button type="submit" className="w-full">
                Créer le trajet
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRide;
