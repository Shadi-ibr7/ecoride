
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Covoiturage } from "@/types/covoiturage";
import Navbar from "@/components/Navbar";
import RidesList from "@/components/rides/RidesList";
import SearchBar from "@/components/SearchBar";
import RideFilters from "@/components/RideFilters";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import NoRidesFound from "@/components/rides/NoRidesFound";
import type { FilterValues } from "@/components/RideFilters";

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

  const { data: covoiturages, isLoading } = useQuery({
    queryKey: ["covoiturages", searchParams],
    queryFn: async () => {
      let query = supabase
        .from("covoiturage")
        .select(`
          *,
          utilise(
            voiture:voiture(
              *,
              marque(*)
            )
          ),
          participe(
            utilisateur:utilisateur(*)
          )
        `);

      if (searchParams.departureCity) {
        query = query.ilike("lieu_depart", `%${searchParams.departureCity}%`);
      }
      if (searchParams.arrivalCity) {
        query = query.ilike("lieu_arrivee", `%${searchParams.arrivalCity}%`);
      }
      if (searchParams.date) {
        query = query.eq("date_depart", searchParams.date);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match the expected format
      const transformedData = data.map((covoiturage: any) => ({
        id: covoiturage.covoiturage_id,
        departureCity: covoiturage.lieu_depart,
        arrivalCity: covoiturage.lieu_arrivee,
        departureTime: `${covoiturage.date_depart}T${covoiturage.heure_depart}`,
        arrivalTime: `${covoiturage.date_arrivee}T${covoiturage.heure_arrivee}`,
        price: covoiturage.prix_personne,
        availableSeats: covoiturage.nb_place,
        driver: {
          id: covoiturage.participe[0]?.utilisateur.utilisateur_id,
          name: `${covoiturage.participe[0]?.utilisateur.prenom} ${covoiturage.participe[0]?.utilisateur.nom}`,
          rating: 5, // TODO: Implement rating system
          photoUrl: "/placeholder.svg", // TODO: Implement photo storage
          preferences: [], // TODO: Implement preferences
          reviews: [] // TODO: Implement reviews
        },
        vehicle: covoiturage.utilise[0]?.voiture ? {
          brand: covoiturage.utilise[0].voiture.marque.libelle || "",
          model: covoiturage.utilise[0].voiture.modele || "",
          energyType: covoiturage.utilise[0].voiture.energie || "Essence"
        } : {
          brand: "Non spécifié",
          model: "Non spécifié",
          energyType: "Non spécifié"
        },
        isEcological: covoiturage.utilise[0]?.voiture?.energie === "Électrique"
      }));

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
    if (!covoiturages || covoiturages.length === 0) return null;
    
    const dates = covoiturages.map(ride => ride.departureTime);
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
            {covoiturages && covoiturages.length > 0 ? (
              <RidesList 
                rides={covoiturages} 
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
