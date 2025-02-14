
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';

const SearchBar = () => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Naviguer vers la page des trajets avec les paramètres de recherche
    navigate(`/rides?from=${departure}&to=${arrival}&date=${date}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="glass p-4 rounded-xl space-y-4 md:space-y-0 md:flex md:space-x-4 animate-in">
        <div className="flex-1">
          <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">
            Départ
          </label>
          <input
            type="text"
            id="departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="Ville de départ"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="arrival" className="block text-sm font-medium text-gray-700 mb-1">
            Arrivée
          </label>
          <input
            type="text"
            id="arrival"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            placeholder="Ville d'arrivée"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Rechercher</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
