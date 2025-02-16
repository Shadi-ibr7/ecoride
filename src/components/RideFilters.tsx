
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Leaf, DollarSign, Clock, Star } from 'lucide-react';

export type FilterValues = {
  isEcological: boolean;
  maxPrice: number | null;
  maxDuration: number | null;
  minRating: number | null;
};

type RideFiltersProps = {
  onFiltersChange: (filters: FilterValues) => void;
};

const RideFilters = ({ onFiltersChange }: RideFiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    isEcological: false,
    maxPrice: null,
    maxDuration: null,
    minRating: null,
  });

  const handleFilterChange = (key: keyof FilterValues, value: boolean | number | null) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="glass p-4 rounded-xl space-y-4">
      <h3 className="font-semibold text-lg text-primary-800 mb-4">Filtres</h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <Label htmlFor="ecological" className="text-sm">
            Voyage écologique
          </Label>
        </div>
        <Switch
          id="ecological"
          checked={filters.isEcological}
          onCheckedChange={(checked) => handleFilterChange('isEcological', checked)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-primary-600" />
          <Label htmlFor="maxPrice" className="text-sm">
            Prix maximum (€)
          </Label>
        </div>
        <Input
          id="maxPrice"
          type="number"
          min="0"
          placeholder="Prix maximum"
          value={filters.maxPrice || ''}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary-600" />
          <Label htmlFor="maxDuration" className="text-sm">
            Durée maximum (heures)
          </Label>
        </div>
        <Input
          id="maxDuration"
          type="number"
          min="0"
          step="0.5"
          placeholder="Durée maximum"
          value={filters.maxDuration || ''}
          onChange={(e) => handleFilterChange('maxDuration', e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <Label htmlFor="minRating" className="text-sm">
            Note minimum du conducteur
          </Label>
        </div>
        <Input
          id="minRating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          placeholder="Note minimum"
          value={filters.minRating || ''}
          onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : null)}
        />
      </div>
    </div>
  );
};

export default RideFilters;
