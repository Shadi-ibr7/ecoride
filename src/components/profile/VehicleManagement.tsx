
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { toast } from "sonner";

interface VehicleInputs {
  brand: string;
  model: string;
  licensePlate: string;
  registrationDate: string;
  color: string;
  seats: string;
}

const VehicleManagement = () => {
  const [vehicleInputs, setVehicleInputs] = useState<VehicleInputs>({
    brand: '',
    model: '',
    licensePlate: '',
    registrationDate: '',
    color: '',
    seats: '4'
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Véhicule ajouté avec succès');
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
        <form onSubmit={handleAddVehicle} className="space-y-4">
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
              <Label htmlFor="registrationDate">Date de première immatriculation</Label>
              <Input 
                id="registrationDate" 
                type="date" 
                value={vehicleInputs.registrationDate} 
                onChange={e => setVehicleInputs({...vehicleInputs, registrationDate: e.target.value})} 
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
              <Label htmlFor="seats">Nombre de places</Label>
              <Input 
                id="seats" 
                type="number" 
                min="1" 
                value={vehicleInputs.seats} 
                onChange={e => setVehicleInputs({...vehicleInputs, seats: e.target.value})} 
                required 
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Ajouter le véhicule</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleManagement;

