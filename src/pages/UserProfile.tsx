import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { History } from 'lucide-react';
import { toast } from "sonner";
import type { Database } from '@/types/database.types';
type UserType = NonNullable<Database['public']['Tables']['profiles']['Row']['user_type']>;
const UserProfile = () => {
  const {
    session
  } = useAuth();
  const navigate = useNavigate();
  const {
    profile,
    updateProfile
  } = useProfile(session?.user?.id);
  const [userType, setUserType] = useState<UserType>(profile?.user_type || 'passenger');
  const [vehicleInputs, setVehicleInputs] = useState({
    brand: '',
    model: '',
    licensePlate: '',
    registrationDate: '',
    color: '',
    seats: '4'
  });
  const [preferences, setPreferences] = useState({
    smoking: false,
    pets: false
  });
  const [customPreference, setCustomPreference] = useState('');
  const [customPreferences, setCustomPreferences] = useState<string[]>([]);
  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);
  if (!session) {
    return null;
  }
  const handleUserTypeChange = async (value: UserType) => {
    try {
      await updateProfile.mutateAsync({
        user_type: value
      });
      setUserType(value);
      toast.success('Type d\'utilisateur mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du type d\'utilisateur');
    }
  };
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Véhicule ajouté avec succès');
  };
  const handleUpdatePreferences = () => {
    toast.success('Préférences mises à jour');
  };
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 bg-gray-50 my-[80px]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="bg-primary-100 text-primary-600 text-2xl">
                {getInitials(session.user?.email)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold text-gray-900">
              Mon Profil
            </h1>
            <p className="text-gray-600">{session.user?.email}</p>
            <Link to="/rides/history">
              <Button variant="outline" className="mt-4">
                <History className="w-4 h-4 mr-2" />
                Voir mon historique de trajets
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Type d'utilisateur</CardTitle>
                <CardDescription>
                  Choisissez votre rôle sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={userType} onValueChange={handleUserTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passenger">Passager</SelectItem>
                    <SelectItem value="driver">Conducteur</SelectItem>
                    <SelectItem value="both">Les deux</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {(userType === 'driver' || userType === 'both') && <>
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
                          <Input id="brand" value={vehicleInputs.brand} onChange={e => setVehicleInputs({
                        ...vehicleInputs,
                        brand: e.target.value
                      })} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Modèle</Label>
                          <Input id="model" value={vehicleInputs.model} onChange={e => setVehicleInputs({
                        ...vehicleInputs,
                        model: e.target.value
                      })} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
                          <Input id="licensePlate" value={vehicleInputs.licensePlate} onChange={e => setVehicleInputs({
                        ...vehicleInputs,
                        licensePlate: e.target.value
                      })} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registrationDate">Date de première immatriculation</Label>
                          <Input id="registrationDate" type="date" value={vehicleInputs.registrationDate} onChange={e => setVehicleInputs({
                        ...vehicleInputs,
                        registrationDate: e.target.value
                      })} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="color">Couleur</Label>
                          <Input id="color" value={vehicleInputs.color} onChange={e => setVehicleInputs({
                        ...vehicleInputs,
                        color: e.target.value
                      })} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="seats">Nombre de places</Label>
                          <Input id="seats" type="number" min="1" value={vehicleInputs.seats} onChange={e => setVehicleInputs({
                        ...vehicleInputs,
                        seats: e.target.value
                      })} required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Ajouter le véhicule</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de conduite</CardTitle>
                    <CardDescription>
                      Définissez vos préférences pour les trajets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smoking">Fumeur autorisé</Label>
                        <Switch id="smoking" checked={preferences.smoking} onCheckedChange={checked => setPreferences({
                      ...preferences,
                      smoking: checked
                    })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pets">Animaux autorisés</Label>
                        <Switch id="pets" checked={preferences.pets} onCheckedChange={checked => setPreferences({
                      ...preferences,
                      pets: checked
                    })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Préférences personnalisées</Label>
                        <div className="flex gap-2">
                          <Input value={customPreference} onChange={e => setCustomPreference(e.target.value)} placeholder="Ajouter une préférence..." />
                          <Button type="button" onClick={() => {
                        if (customPreference) {
                          setCustomPreferences([...customPreferences, customPreference]);
                          setCustomPreference('');
                        }
                      }}>
                            Ajouter
                          </Button>
                        </div>
                        <div className="space-y-2 mt-2">
                          {customPreferences.map((pref, index) => <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>{pref}</span>
                              <Button variant="ghost" size="sm" onClick={() => setCustomPreferences(customPreferences.filter((_, i) => i !== index))}>
                                Supprimer
                              </Button>
                            </div>)}
                        </div>
                        <Button className="w-full mt-4" onClick={handleUpdatePreferences}>
                          Enregistrer les préférences
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>}
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default UserProfile;