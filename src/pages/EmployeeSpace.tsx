
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

  // Vérifier que l'utilisateur est connecté
  useEffect(() => {
    if (!session) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate('/login');
      return;
    }
  }, [session, navigate]);

  // Vérifier que l'utilisateur est bien un employé ou un admin
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Récupérer les avis en attente de validation
  const { data: pendingReviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['pending-reviews'],
    queryFn: async () => {
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

  if (isLoadingProfile || !session) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (userProfile?.user_type !== 'employee' && userProfile?.user_type !== 'admin') {
    toast.error("Accès non autorisé");
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-4">
        <h1 className="text-2xl font-bold mb-6">Espace Employé</h1>

        <Tabs defaultValue="reviews" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reviews">Avis en attente</TabsTrigger>
            <TabsTrigger value="problems">Trajets problématiques</TabsTrigger>
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
  );
};

export default EmployeeSpace;
