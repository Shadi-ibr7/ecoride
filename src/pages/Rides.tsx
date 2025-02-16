import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, addDays, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import RideCard from '@/components/RideCard';
import RideFilters from '@/components/RideFilters';
import type { Ride } from '@/types/ride';
import type { FilterValues } from '@/components/RideFilters';

const mockRides: Ride[] = [
  {
    id: 1,
    driver: {
      id: 1,
      name: "Marie L.",
      rating: 4.8,
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
      preferences: ["Pas de fumée", "Musique calme"],
      reviews: [
        {
          id: 1,
          author: "Thomas R.",
          rating: 5,
          comment: "Excellent voyage, conductrice très agréable",
          date: "2024-03-15"
        }
      ]
    },
    vehicle: {
      brand: "Tesla",
      model: "Model 3",
      energyType: "Électrique"
    },
    availableSeats: 3,
    price: 15,
    departureCity: "Lyon",
    arrivalCity: "Paris",
    departureTime: "2024-04-15T08:00:00",
    arrivalTime: "2024-04-15T13:00:00",
    isEcological: true
  },
  {
    id: 2,
    driver: {
      id: 2,
      name: "Thomas R.",
      rating: 4.5,
      photoUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop",
      preferences: ["Discussion amicale", "Petits bagages uniquement"],
      reviews: [
        {
          id: 2,
          author: "Sophie M.",
          rating: 4.5,
          comment: "Très bon trajet, ponctuel et sympathique",
          date: "2024-03-10"
        }
      ]
    },
    vehicle: {
      brand: "Peugeot",
      model: "208",
      energyType: "Essence"
    },
    availableSeats: 2,
    price: 20,
    departureCity: "Paris",
    arrivalCity: "Bordeaux",
    departureTime: "2024-04-16T09:00:00",
    arrivalTime: "2024-04-16T15:00:00",
    isEcological: false
  }
];

const Rides = () => {
  const [searchParams] = useSearchParams();
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearestRideDate, setNearestRideDate] = useState<string | null>(null);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  const applyFilters = (ridesData: Ride[], filters: FilterValues) => {
    return ridesData.filter(ride => {
      if (filters.isEcological && !ride.isEcological) return false;
      if (filters.maxPrice && ride.price > filters.maxPrice) return false;
      if (filters.maxDuration) {
        const durationInHours = differenceInHours(
          new Date(ride.arrivalTime),
          new Date(ride.departureTime)
        );
        if (durationInHours > filters.maxDuration) return false;
      }
      if (filters.minRating && ride.driver.rating < filters.minRating) return false;
      return true;
    });
  };

  useEffect(() => {
    const searchRides = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (from && to && date) {
          const filteredRides = mockRides.filter(ride => 
            ride.departureCity.toLowerCase().includes(from.toLowerCase()) &&
            ride.arrivalCity.toLowerCase().includes(to.toLowerCase()) &&
            ride.availableSeats > 0
          );

          if (filteredRides.length === 0) {
            const nextRideDate = format(addDays(new Date(date), 3), 'yyyy-MM-dd');
            setNearestRideDate(nextRideDate);
          }

          setRides(filteredRides);
          setFilteredRides(filteredRides);
        }
      } catch (error) {
        console.error('Erreur lors de la recherche des trajets:', error);
      } finally {
        setLoading(false);
      }
    };

    searchRides();
  }, [from, to, date]);

  const handleFiltersChange = (filters: FilterValues) => {
    const newFilteredRides = applyFilters(rides, filters);
    setFilteredRides(newFilteredRides);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />

          <div className="mt-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse text-primary-600">Recherche des trajets...</div>
              </div>
            ) : (
              <>
                {from && to && date ? (
                  <>
                    {rides.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                          <RideFilters onFiltersChange={handleFiltersChange} />
                        </div>
                        
                        <div className="md:col-span-3 space-y-6">
                          <h2 className="text-2xl font-semibold text-gray-800">
                            {filteredRides.length} trajet{filteredRides.length > 1 ? 's' : ''} disponible{filteredRides.length > 1 ? 's' : ''} de {from} à {to}
                          </h2>
                          {filteredRides.map(ride => (
                            <RideCard key={ride.id} ride={ride} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          <div>
                            <p>Aucun trajet disponible pour cette date.</p>
                            {nearestRideDate && (
                              <p className="mt-2">
                                Premier trajet disponible le{' '}
                                {format(new Date(nearestRideDate), 'PPP', { locale: fr })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-600">
                    Utilisez la barre de recherche ci-dessus pour trouver un trajet
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rides;
