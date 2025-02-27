
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import RidesList from "@/components/rides/RidesList";
import SearchBar from "@/components/SearchBar";
import RideFilters from "@/components/RideFilters";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import NoRidesFound from "@/components/rides/NoRidesFound";
import type { FilterValues } from "@/components/RideFilters";
import type { Ride } from "@/types/ride";

// Rides imaginaires pour démonstration
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

const Rides = () => {
  const [searchParams, setSearchParams] = useState({
    departureCity: "",
    arrivalCity: "",
    date: ""
  });
  const [filters, setFilters] = useState<FilterValues>({
    isEcological: false,
    maxPrice: null,
    maxDuration: null,
    minRating: null
  });

  const {
    data: dbRides,
    isLoading
  } = useQuery({
    queryKey: ["rides", searchParams],
    queryFn: async () => {
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
    }
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
  const rides = (dbRides && dbRides.length > 0) ? dbRides : filteredPlaceholderRides;

  const handleSearch = (params: {
    departureCity: string;
    arrivalCity: string;
    date: string;
  }) => {
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const getNearestRideDate = () => {
    if (!rides || rides.length === 0) return null;
    const dates = rides.map(ride => ride.departureTime);
    return dates.sort()[0];
  };

  if (isLoading) {
    return <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>;
  }

  return <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-[130px]">
        <h1 className="text-4xl font-bold text-center mb-8">
          Trouvez votre covoiturage idéal
        </h1>
        <SearchBar onSearch={handleSearch} />
        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-1/4">
            <RideFilters onFiltersChange={handleFiltersChange} />
          </aside>
          <div className="flex-1">
            {rides && rides.length > 0 ? (
              <div>
                <p className="mb-4 text-gray-600">
                  {dbRides && dbRides.length > 0 
                    ? `${rides.length} trajet(s) trouvé(s)` 
                    : "Nous vous proposons ces trajets de démonstration"}
                </p>
                <RidesList 
                  rides={rides} 
                  from={searchParams.departureCity || "Toutes les villes"} 
                  to={searchParams.arrivalCity || "Toutes les villes"} 
                />
              </div>
            ) : (
              <NoRidesFound nearestRideDate={getNearestRideDate()} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};

export default Rides;
