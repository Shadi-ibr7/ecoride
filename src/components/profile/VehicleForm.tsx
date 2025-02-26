
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const VehicleForm = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleInputs, setVehicleInputs] = useState({
    brand: '',
    model: '',
    licensePlate: '',
    color: '',
    energyType: '',
    seats: '4'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error('Vous devez être connecté pour ajouter un véhicule');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('vehicles')
        .insert([{
          owner_id: session.user.id,
          brand: vehicleInputs.brand,
          model: vehicleInputs.model,
          license_plate: vehicleInputs.licensePlate,
          color: vehicleInputs.color,
          energy_type: vehicleInputs.energyType,
          seats: parseInt(vehicleInputs.seats)
        }]);

      if (error) throw error;

      toast.success('Véhicule ajouté avec succès');
      // Reset form
      setVehicleInputs({
        brand: '',
        model: '',
        licensePlate: '',
        color: '',
        energyType: '',
        seats: '4'
      });
      // Refresh vehicles list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Erreur lors de l\'ajout du véhicule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un véhicule</CardTitle>
        <CardDescription>
          Renseignez les informations de votre véhicule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input 
                id="brand"
                value={vehicleInputs.brand}
                onChange={e => setVehicleInputs({...vehicleInputs, brand: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modèle</Label>
              <Input 
                id="model"
                value={vehicleInputs.model}
                onChange={e => setVehicleInputs({...vehicleInputs, model: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
              <Input 
                id="licensePlate"
                value={vehicleInputs.licensePlate}
                onChange={e => setVehicleInputs({...vehicleInputs, licensePlate: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <Input 
                id="color"
                value={vehicleInputs.color}
                onChange={e => setVehicleInputs({...vehicleInputs, color: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="energyType">Type d'énergie</Label>
              <Select
                value={vehicleInputs.energyType}
                onValueChange={(value) => setVehicleInputs({...vehicleInputs, energyType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type d'énergie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Essence">Essence</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Électrique">Électrique</SelectItem>
                  <SelectItem value="Hybride">Hybride</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats">Nombre de places</Label>
              <Input 
                id="seats"
                type="number"
                min="1"
                max="9"
                value={vehicleInputs.seats}
                onChange={e => setVehicleInputs({...vehicleInputs, seats: e.target.value})}
                required 
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter le véhicule'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
