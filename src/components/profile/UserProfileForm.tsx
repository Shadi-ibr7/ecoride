
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { UserType } from '@/types/profile';
import { Plus, X } from 'lucide-react';

export const UserProfileForm = () => {
  const { profile, vehicles, preferences, updateProfile, addVehicle, updatePreferences } = useUserProfile();
  const [newVehicle, setNewVehicle] = useState({
    license_plate: '',
    registration_date: '',
    brand: '',
    model: '',
    color: '',
    seats: 4,
  });
  const [customPreference, setCustomPreference] = useState('');
  const [customPreferences, setCustomPreferences] = useState<string[]>([]);

  const handleUserTypeChange = (value: UserType) => {
    updateProfile.mutate({ user_type: value });
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle.mutate(newVehicle);
    setNewVehicle({
      license_plate: '',
      registration_date: '',
      brand: '',
      model: '',
      color: '',
      seats: 4,
    });
  };

  const handleUpdatePreferences = () => {
    updatePreferences.mutate({
      driverPrefs: {
        driver_id: profile?.id || '',
        smoking_allowed: preferences?.driver?.smoking_allowed || false,
        pets_allowed: preferences?.driver?.pets_allowed || false,
      },
      customPrefs: customPreferences.map(preference => ({
        driver_id: profile?.id || '',
        preference,
      })),
    });
  };

  const addCustomPreference = () => {
    if (customPreference && !customPreferences.includes(customPreference)) {
      setCustomPreferences([...customPreferences, customPreference]);
      setCustomPreference('');
    }
  };

  const removeCustomPreference = (index: number) => {
    setCustomPreferences(customPreferences.filter((_, i) => i !== index));
  };

  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Type d'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={profile.user_type}
            onValueChange={handleUserTypeChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="passenger" id="passenger" />
              <Label htmlFor="passenger">Passager</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="driver" id="driver" />
              <Label htmlFor="driver">Chauffeur</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Les deux</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {(profile.user_type === 'driver' || profile.user_type === 'both') && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Véhicules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicles?.map((vehicle) => (
                <div key={vehicle.id} className="p-4 border rounded-lg">
                  <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                  <p className="text-sm text-gray-600">
                    Immatriculation: {vehicle.license_plate} | 
                    Places: {vehicle.seats} | 
                    Couleur: {vehicle.color}
                  </p>
                </div>
              ))}

              <form onSubmit={handleAddVehicle} className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Ajouter un véhicule</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="license_plate">Immatriculation</Label>
                    <Input
                      id="license_plate"
                      value={newVehicle.license_plate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="registration_date">Date de première immatriculation</Label>
                    <Input
                      id="registration_date"
                      type="date"
                      value={newVehicle.registration_date}
                      onChange={(e) => setNewVehicle({ ...newVehicle, registration_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Marque</Label>
                    <Input
                      id="brand"
                      value={newVehicle.brand}
                      onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modèle</Label>
                    <Input
                      id="model"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Couleur</Label>
                    <Input
                      id="color"
                      value={newVehicle.color}
                      onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="seats">Nombre de places</Label>
                    <Input
                      id="seats"
                      type="number"
                      min="1"
                      value={newVehicle.seats}
                      onChange={(e) => setNewVehicle({ ...newVehicle, seats: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit">Ajouter le véhicule</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="smoking">Fumeur autorisé</Label>
                  <Switch
                    id="smoking"
                    checked={preferences?.driver?.smoking_allowed}
                    onCheckedChange={(checked) => 
                      updatePreferences.mutate({
                        driverPrefs: {
                          driver_id: profile.id,
                          smoking_allowed: checked,
                          pets_allowed: preferences?.driver?.pets_allowed || false,
                        },
                        customPrefs: customPreferences.map(preference => ({
                          driver_id: profile.id,
                          preference,
                        })),
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pets">Animaux autorisés</Label>
                  <Switch
                    id="pets"
                    checked={preferences?.driver?.pets_allowed}
                    onCheckedChange={(checked) =>
                      updatePreferences.mutate({
                        driverPrefs: {
                          driver_id: profile.id,
                          pets_allowed: checked,
                          smoking_allowed: preferences?.driver?.smoking_allowed || false,
                        },
                        customPrefs: customPreferences.map(preference => ({
                          driver_id: profile.id,
                          preference,
                        })),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Préférences personnalisées</h4>
                <div className="flex space-x-2">
                  <Input
                    value={customPreference}
                    onChange={(e) => setCustomPreference(e.target.value)}
                    placeholder="Ajouter une préférence..."
                  />
                  <Button onClick={addCustomPreference} type="button" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {customPreferences.map((pref, index) => (
                    <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                      <span>{pref}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeCustomPreference(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default UserProfileForm;
