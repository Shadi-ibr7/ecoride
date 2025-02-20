
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

const Rides = () => {
  const [searchParams, setSearchParams] = useState({
    departureCity: "",
    arrivalCity: "",
    date: "",
  });

  const [filters, setFilters] = useState<FilterValues>({
    isEcological: false,
    maxPrice: null,
    maxDuration: null,
    minRating: null,
  });

  const { data: rides, isLoading } = useQuery({
    queryKey: ["rides", searchParams],
    queryFn: async () => {
      console.log("Fetching rides with params:", searchParams);
      
      let query = supabase
        .from("rides")
        .select(`
          *,
          driver:profiles(*)
        `);

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

      console.log("Query response:", { data, error });

      if (error) throw error;

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
          preferences: rideData.driver?.preferences || [],
          reviews: []
        },
        vehicle: {
          brand: rideData.vehicle_brand || "Non spécifié",
          model: rideData.vehicle_model || "Non spécifié",
          energyType: rideData.vehicle_energy_type || "Essence"
        },
        isEcological: rideData.vehicle_energy_type === "Électrique"
      }));

      console.log("Transformed data:", transformedData);

      return transformedData;
    }
  });

  const handleSearch = (params: { departureCity: string; arrivalCity: string; date: string }) => {
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  // Trouver la date la plus proche d'un trajet disponible
  const getNearestRideDate = () => {
    if (!rides || rides.length === 0) return null;
    
    const dates = rides.map(ride => ride.departureTime);
    return dates.sort()[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
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
              <RidesList 
                rides={rides} 
                from={searchParams.departureCity || "Toutes les villes"} 
                to={searchParams.arrivalCity || "Toutes les villes"} 
              />
            ) : (
              <NoRidesFound nearestRideDate={getNearestRideDate()} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rides;
