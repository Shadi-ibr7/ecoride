
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
}

interface VehicleFormProps {
  vehicles: Vehicle[] | null;
  selectedVehicle: string | null;
  onVehicleSelect: (vehicleId: string | null) => void;
  showNewVehicleForm: boolean;
  onToggleNewVehicleForm: () => void;
}

const VehicleForm = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  showNewVehicleForm,
  onToggleNewVehicleForm,
}: VehicleFormProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Véhicule</h3>
      <div>
        {vehicles && vehicles.length > 0 && (
          <div className="mb-4">
            <Label>Sélectionner un véhicule existant</Label>
            <Select onValueChange={onVehicleSelect} value={selectedVehicle || undefined}>
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
          onClick={onToggleNewVehicleForm}
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
  );
};

export default VehicleForm;
