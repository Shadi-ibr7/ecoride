
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (params: { departureCity: string; arrivalCity: string; date: string }) => void;
  className?: string;
}

const SearchBar = ({ onSearch, className }: SearchBarProps) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = {
      departureCity: departure,
      arrivalCity: arrival,
      date: date,
    };
    
    if (onSearch) {
      onSearch(searchParams);
    } else {
      // Si aucun onSearch n'est fourni, rediriger vers la page des trajets avec les paramètres
      const queryParams = new URLSearchParams();
      if (departure) queryParams.append('departure', departure);
      if (arrival) queryParams.append('arrival', arrival);
      if (date) queryParams.append('date', date);
      
      navigate(`/rides?${queryParams.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-white shadow-lg rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="departure" className="block text-sm font-medium text-gray-700">
            Départ
          </label>
          <Input
            type="text"
            id="departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="Ville de départ"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="arrival" className="block text-sm font-medium text-gray-700">
            Arrivée
          </label>
          <Input
            type="text"
            id="arrival"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            placeholder="Ville d'arrivée"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-end">
          <Button 
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium"
          >
            <Search className="w-5 h-5 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
