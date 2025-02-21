
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PriceAndSeatsFormProps {
  price: number;
  onPriceChange: (price: number) => void;
}

const PriceAndSeatsForm = ({ price, onPriceChange }: PriceAndSeatsFormProps) => {
  const { session } = useAuth();
  const [seats, setSeats] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Vous devez être connecté pour créer un trajet");
      return;
    }

    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          price,
          available_seats: seats
        })
        .eq('driver_id', session.user.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Error updating ride:', error);
        toast.error("Erreur lors de la mise à jour du trajet");
        return;
      }

      toast.success("Prix et places mis à jour avec succès");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
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
              onChange={(e) => onPriceChange(Number(e.target.value))}
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
          <Input 
            type="number" 
            name="available_seats" 
            min="1" 
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            required 
          />
        </div>
      </div>
      <button 
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
      >
        Mettre à jour le prix et les places
      </button>
    </form>
  );
};

export default PriceAndSeatsForm;
