
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

interface PriceAndSeatsFormProps {
  price: number;
  onPriceChange: (price: number) => void;
}

const PriceAndSeatsForm = ({ price, onPriceChange }: PriceAndSeatsFormProps) => {
  return (
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
          <Input type="number" name="available_seats" min="1" required />
        </div>
      </div>
    </div>
  );
};

export default PriceAndSeatsForm;
