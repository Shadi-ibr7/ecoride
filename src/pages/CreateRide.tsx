
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { Info } from 'lucide-react';

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
              {/* Section trajet */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Informations du trajet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Départ</Label>
                    <Input 
                      name="departure" 
                      placeholder="Ville de départ"
                      required 
                    />
                  </div>
                  <div>
                    <Label>Arrivée</Label>
                    <Input 
                      name="arrival" 
                      placeholder="Ville d'arrivée"
                      required 
                    />
                  </div>
                  <div>
                    <Label>Date et heure de départ</Label>
                    <Input type="datetime-local" name="departure_time" required />
                  </div>
                  <div>
                    <Label>Date et heure d'arrivée</Label>
                    <Input type="datetime-local" name="arrival_time" required />
                  </div>
                </div>
              </div>

              {/* Section prix et places */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Prix et places disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix par passager</Label>
                    <div className="mt-1 relative">
                      <Input
                        type="number"
                        name="price"
                        min="2"
                        step="0.5"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                      />
                      <div className="text-sm text-gray-500 mt-1 flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Prix minimum : 2 crédits (frais de plateforme)
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Places disponibles</Label>
                    <Input type="number" name="available_seats" min="1" required />
                  </div>
                </div>
              </div>

              {/* Section véhicule */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Véhicule</h3>
                <div>
                  {vehicles && vehicles.length > 0 && (
                    <div className="mb-4">
                      <Label>Sélectionner un véhicule existant</Label>
                      <Select onValueChange={setSelectedVehicle} value={selectedVehicle || undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez un véhicule" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewVehicleForm(!showNewVehicleForm);
                      setSelectedVehicle(null);
                    }}
                  >
                    {showNewVehicleForm ? "Utiliser un véhicule existant" : "Ajouter un nouveau véhicule"}
                  </Button>
                </div>

                {showNewVehicleForm && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Marque</Label>
                        <Input name="brand" required />
                      </div>
                      <div>
                        <Label>Modèle</Label>
                        <Input name="model" required />
                      </div>
                      <div>
                        <Label>Plaque d'immatriculation</Label>
                        <Input name="license_plate" required />
                      </div>
                      <div>
                        <Label>Couleur</Label>
                        <Input name="color" required />
                      </div>
                      <div>
                        <Label>Type d'énergie</Label>
                        <Select name="energy_type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir le type d'énergie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Essence">Essence</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Électrique">Électrique</SelectItem>
                            <SelectItem value="Hybride">Hybride</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nombre de places</Label>
                        <Input type="number" name="seats" min="1" required />
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
