
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from 'react';
import { toast } from "sonner";

const DriverPreferences = () => {
  const [preferences, setPreferences] = useState({
    smoking: false,
    pets: false
  });
  const [customPreference, setCustomPreference] = useState('');
  const [customPreferences, setCustomPreferences] = useState<string[]>([]);

  const handleUpdatePreferences = () => {
    toast.success('Préférences mises à jour');
  };

  return (
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
            <Switch 
              id="smoking" 
              checked={preferences.smoking} 
              onCheckedChange={checked => setPreferences({...preferences, smoking: checked})} 
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pets">Animaux autorisés</Label>
            <Switch 
              id="pets" 
              checked={preferences.pets} 
              onCheckedChange={checked => setPreferences({...preferences, pets: checked})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Préférences personnalisées</Label>
            <div className="flex gap-2">
              <Input 
                value={customPreference} 
                onChange={e => setCustomPreference(e.target.value)} 
                placeholder="Ajouter une préférence..." 
              />
              <Button 
                type="button" 
                onClick={() => {
                  if (customPreference) {
                    setCustomPreferences([...customPreferences, customPreference]);
                    setCustomPreference('');
                  }
                }}
              >
                Ajouter
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {customPreferences.map((pref, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{pref}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setCustomPreferences(customPreferences.filter((_, i) => i !== index))}
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" onClick={handleUpdatePreferences}>
              Enregistrer les préférences
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverPreferences;

