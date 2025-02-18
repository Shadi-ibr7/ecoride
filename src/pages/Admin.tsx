
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import RidesChart from '@/components/admin/RidesChart';
import EarningsChart from '@/components/admin/EarningsChart';
import UsersTable from '@/components/admin/UsersTable';

const Admin = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (userProfile && userProfile.user_type !== 'admin') {
      navigate('/');
    }
  }, [userProfile, navigate]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (userProfile?.user_type !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Vous n'avez pas les droits d'accès à cette page.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Retourner à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Espace Administrateur</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RidesChart />
          <EarningsChart />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <UsersTable />
        </div>
      </div>
    </div>
  );
};

export default Admin;
