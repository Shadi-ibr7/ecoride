
import { useState } from 'react';
import NavbarStyled from '@/components/NavbarStyled';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import RidesList from '@/components/rides/RidesList';
import { Heart, DollarSign, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import NoRidesFound from '@/components/rides/NoRidesFound';
import type { Ride } from '@/types/ride';

// Trajets de démonstration pour affichage quand aucun trajet n'est trouvé
const placeholderRides: Ride[] = [
  {
    id: "demo-1",
    departureCity: "Paris",
    arrivalCity: "Lyon",
    departureTime: new Date(Date.now() + 86400000).toISOString(), // demain
    arrivalTime: new Date(Date.now() + 86400000 + 10800000).toISOString(), // demain + 3h
    price: 25,
    availableSeats: 3,
    driver: {
      id: 101,
      name: "Thomas Martin",
      rating: 4.7,
      photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      preferences: ["Calme", "Musique"],
      reviews: []
    },
    vehicle: {
      brand: "Renault",
      model: "Zoe",
      energyType: "Électrique"
    },
    isEcological: true
  },
  {
    id: "demo-2",
    departureCity: "Marseille",
    arrivalCity: "Nice",
    departureTime: new Date(Date.now() + 172800000).toISOString(), // après-demain
    arrivalTime: new Date(Date.now() + 172800000 + 7200000).toISOString(), // après-demain + 2h
    price: 15,
    availableSeats: 2,
    driver: {
      id: 102,
      name: "Sophie Dubois",
      rating: 4.9,
      photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      preferences: ["Discussion", "Musique"],
      reviews: []
    },
    vehicle: {
      brand: "Toyota",
      model: "Prius",
      energyType: "Hybride"
    },
    isEcological: true
  },
  {
    id: "demo-3",
    departureCity: "Bordeaux",
    arrivalCity: "Toulouse",
    departureTime: new Date(Date.now() + 259200000).toISOString(), // dans 3 jours
    arrivalTime: new Date(Date.now() + 259200000 + 7200000).toISOString(), // dans 3 jours + 2h
    price: 18,
    availableSeats: 4,
    driver: {
      id: 103,
      name: "Pierre Leroy",
      rating: 4.5,
      photoUrl: "https://randomuser.me/api/portraits/men/67.jpg",
      preferences: ["Non-fumeur", "Animaux acceptés"],
      reviews: []
    },
    vehicle: {
      brand: "Volkswagen",
      model: "ID.4",
      energyType: "Électrique"
    },
    isEcological: true
  }
];

const Index = () => {
  const [searchParams, setSearchParams] = useState({
    departureCity: "",
    arrivalCity: "",
    date: ""
  });
  const [showResults, setShowResults] = useState(false);

  const {
    data: dbRides,
    isLoading
  } = useQuery({
    queryKey: ["rides", searchParams, showResults],
    queryFn: async () => {
      // Ne pas exécuter la requête si aucune recherche n'a été effectuée
      if (!showResults) return [];
      
      try {
        let query = supabase.from("rides").select(`
            *,
            driver:driver_id (
              id,
              full_name,
              rating
            )
          `).eq('status', 'pending');
          
        if (searchParams.departureCity) {
          query = query.ilike("departure_address", `%${searchParams.departureCity}%`);
        }
        if (searchParams.arrivalCity) {
          query = query.ilike("arrival_address", `%${searchParams.arrivalCity}%`);
        }
        if (searchParams.date) {
          query = query.eq("departure_time", searchParams.date);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching rides:", error);
          return [];
        }

        // Transform the data to match the Ride type
        const transformedData: Ride[] = data.map((rideData: any) => ({
          id: rideData.id,
          departureCity: rideData.departure_address,
          arrivalCity: rideData.arrival_address,
          departureTime: rideData.departure_time,
          arrivalTime: rideData.arrival_time,
          price: rideData.price,
          availableSeats: rideData.available_seats,
          driver: {
            id: rideData.driver?.id,
            name: rideData.driver?.full_name || "Conducteur",
            rating: rideData.driver?.rating || 4.5,
            photoUrl: rideData.driver?.photo_url || "/placeholder.svg",
            preferences: [],
            reviews: []
          },
          vehicle: {
            brand: rideData.vehicle_brand || "Non spécifié",
            model: rideData.vehicle_model || "Non spécifié",
            energyType: rideData.vehicle_energy_type || "Essence"
          },
          isEcological: rideData.vehicle_energy_type === "Électrique"
        }));
        
        return transformedData;
      } catch (error) {
        console.error("Error in fetchRides:", error);
        return [];
      }
    },
    enabled: showResults
  });

  // Filtrer les trajets démonstratifs en fonction des recherches
  const filteredPlaceholderRides = placeholderRides.filter(ride => {
    const matchesDeparture = !searchParams.departureCity || 
      ride.departureCity.toLowerCase().includes(searchParams.departureCity.toLowerCase());
    const matchesArrival = !searchParams.arrivalCity || 
      ride.arrivalCity.toLowerCase().includes(searchParams.arrivalCity.toLowerCase());
    
    return matchesDeparture && matchesArrival;
  });

  // Combiner les trajets réels et démonstratifs
  const rides = showResults ? ((dbRides && dbRides.length > 0) ? dbRides : filteredPlaceholderRides) : [];

  const handleSearch = (params: {
    departureCity: string;
    arrivalCity: string;
    date: string;
  }) => {
    setSearchParams(params);
    setShowResults(true);
    window.scrollTo({
      top: document.getElementById('search-results')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarStyled />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-[#1B4332] text-center mb-6">
            Voyagez différemment avec <span className="text-primary-600">EcoRide</span>
          </h1>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 text-lg">
            Rejoignez notre communauté de covoiturage écologique et économique. Ensemble, réduisons notre empreinte carbone.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Search Results Section */}
      {showResults && (
        <section id="search-results" className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1B4332] mb-8">
              Résultats de recherche
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : rides.length > 0 ? (
              <RidesList 
                rides={rides} 
                from={searchParams.departureCity || "Toutes les villes"} 
                to={searchParams.arrivalCity || "Toutes les villes"} 
              />
            ) : (
              <NoRidesFound nearestRideDate={null} />
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1B4332] mb-6">
              Votre partenaire pour une mobilité durable
            </h2>
            <p className="text-gray-600 mb-8">
              EcoRide est né d'une vision simple : rendre le covoiturage plus accessible, plus écologique et plus convivial. Notre plateforme connecte des milliers de voyageurs partageant les mêmes valeurs environnementales.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-600">
                <span className="text-primary-600 mr-2">✓</span>
                Plus de 50 000 trajets partagés
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-primary-600 mr-2">✓</span>
                -30% d'émissions de CO2
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-primary-600 mr-2">✓</span>
                Communauté de 20 000 membres
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=60" 
              alt="Tesla Modèle S" 
              className="rounded-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800&auto=format&fit=crop&q=60" 
              alt="Tesla Model X" 
              className="rounded-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60" 
              alt="Tesla Model 3" 
              className="rounded-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1616789916664-af15aa741d3f?w=800&auto=format&fit=crop&q=60" 
              alt="Porsche Taycan" 
              className="rounded-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop&q=60" 
              alt="BMW i8" 
              className="rounded-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1607670653587-8caa6c6c4c71?w=800&auto=format&fit=crop&q=60" 
              alt="Audi e-tron" 
              className="rounded-lg w-full h-48 object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#1B4332] text-center mb-12">
            Pourquoi choisir EcoRide ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Économique</h3>
              <p className="text-gray-600">
                Partagez les frais de transport et réduisez vos dépenses de déplacement.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Écologique</h3>
              <p className="text-gray-600">
                Réduisez votre empreinte carbone en partageant votre trajet avec d'autres voyageurs.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Communautaire</h3>
              <p className="text-gray-600">
                Rejoignez une communauté de voyageurs partageant les mêmes valeurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
