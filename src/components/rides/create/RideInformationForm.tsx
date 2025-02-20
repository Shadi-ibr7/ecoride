
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const RideInformationForm = () => {
  return (
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
  );
};

export default RideInformationForm;
