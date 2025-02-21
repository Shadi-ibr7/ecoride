
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface RideFormState {
  departure: string;
  arrival: string;
  departure_time: string;
  arrival_time: string;
}

const RideInformationForm = () => {
  const { session } = useAuth();
  const [formState, setFormState] = useState<RideFormState>({
    departure: '',
    arrival: '',
    departure_time: '',
    arrival_time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Vous devez être connecté pour créer un trajet");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('rides')
        .insert([
          {
            driver_id: session.user.id,
            departure_address: formState.departure,
            arrival_address: formState.arrival,
            departure_time: new Date(formState.departure_time).toISOString(),
            arrival_time: new Date(formState.arrival_time).toISOString(),
            price: 0, // La valeur sera mise à jour par PriceAndSeatsForm
            available_seats: 1, // La valeur sera mise à jour par PriceAndSeatsForm
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Error creating ride:', error);
        toast.error("Erreur lors de la création du trajet");
        return;
      }

      if (data) {
        toast.success("Trajet créé avec succès");
        // Reset form
        setFormState({
          departure: '',
          arrival: '',
          departure_time: '',
          arrival_time: '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Informations du trajet</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Départ</Label>
          <Input 
            name="departure" 
            placeholder="Ville de départ"
            value={formState.departure}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <Label>Arrivée</Label>
          <Input 
            name="arrival" 
            placeholder="Ville d'arrivée"
            value={formState.arrival}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <Label>Date et heure de départ</Label>
          <Input 
            type="datetime-local" 
            name="departure_time"
            value={formState.departure_time}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <Label>Date et heure d'arrivée</Label>
          <Input 
            type="datetime-local" 
            name="arrival_time"
            value={formState.arrival_time}
            onChange={handleChange}
            required 
          />
        </div>
      </div>
      <button 
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
      >
        Créer le trajet
      </button>
    </form>
  );
};

export default RideInformationForm;

