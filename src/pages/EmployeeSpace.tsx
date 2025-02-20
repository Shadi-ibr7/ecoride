
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import PendingReviews from '@/components/employee/PendingReviews';
import ProblematicRides from '@/components/employee/ProblematicRides';

const EmployeeSpace = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  // Vérifier que l'utilisateur est connecté et est un employé/admin
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("Non connecté");
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      console.log("Profil utilisateur:", data); // Debug log
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Gérer les états de chargement et d'erreur
  useEffect(() => {
    if (!isLoadingProfile && !session) {
      console.log("Pas de session, redirection vers login"); // Debug log
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate('/login');
      return;
    }

    if (!isLoadingProfile && userProfile && 
        userProfile.user_type !== 'employee' && 
        userProfile.user_type !== 'admin') {
      console.log("Pas les bonnes permissions:", userProfile.user_type); // Debug log
      toast.error("Vous n'avez pas accès à cette page");
      navigate('/');
      return;
    }
  }, [session, userProfile, isLoadingProfile, navigate]);

  // Récupérer les avis en attente de validation
  const { data: pendingReviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['pending-reviews'],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('ride_validations')
        .select(`
          *,
          booking:ride_bookings (
            id,
            passenger:profiles!ride_bookings_passenger_id_fkey (
              username,
              auth_users (
                email
              )
            ),
            ride:rides (
              id,
              departure_address,
              arrival_address,
              departure_time,
              arrival_time,
              driver:profiles!rides_driver_id_fkey (
                username,
                auth_users (
                  email
                )
              )
            )
          )
        `)
        .eq('validation_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && (userProfile?.user_type === 'employee' || userProfile?.user_type === 'admin'),
  });

  // Récupérer les trajets problématiques
  const { data: problematicRides, isLoading: isLoadingProblematic } = useQuery({
    queryKey: ['problematic-rides'],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('ride_validations')
        .select(`
          *,
          booking:ride_bookings (
            id,
            passenger:profiles!ride_bookings_passenger_id_fkey (
              username,
              auth_users (
                email
              )
            ),
            ride:rides (
              id,
              departure_address,
              arrival_address,
              departure_time,
              arrival_time,
              driver:profiles!rides_driver_id_fkey (
                username,
                auth_users (
                  email
                )
              )
            )
          )
        `)
        .eq('is_validated', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && (userProfile?.user_type === 'employee' || userProfile?.user_type === 'admin'),
  });

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 flex items-center justify-center">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // N'affichez le contenu que si l'utilisateur est un employé ou un admin
  if (!userProfile || (userProfile.user_type !== 'employee' && userProfile.user_type !== 'admin')) {
    return null; // Le useEffect s'occupera de la redirection
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-28">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">Espace Employé</h1>
            <p className="text-gray-600 mb-6">
              Gérez les avis des utilisateurs et surveillez les trajets problématiques
            </p>

            <Tabs defaultValue="reviews" className="space-y-6">
              <TabsList className="bg-primary-100/50 p-1">
                <TabsTrigger 
                  value="reviews" 
                  className="data-[state=active]:bg-white data-[state=active]:text-primary-600"
                >
                  Avis en attente
                </TabsTrigger>
                <TabsTrigger 
                  value="problems"
                  className="data-[state=active]:bg-white data-[state=active]:text-primary-600"
                >
                  Trajets problématiques
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reviews">
                <PendingReviews 
                  reviews={pendingReviews || []}
                  isLoading={isLoadingReviews}
                />
              </TabsContent>

              <TabsContent value="problems">
                <ProblematicRides 
                  rides={problematicRides || []}
                  isLoading={isLoadingProblematic}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSpace;
