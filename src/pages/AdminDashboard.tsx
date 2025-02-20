
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CreateEmployeeDialog from '@/components/admin/CreateEmployeeDialog';
import EarningsChart from '@/components/admin/EarningsChart';
import RidesChart from '@/components/admin/RidesChart';
import UsersTable from '@/components/admin/UsersTable';
import Navbar from '@/components/Navbar';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'jose@gmail.com';

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Vérification de l'authentification et des droits admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      if (session.user.email !== ADMIN_EMAIL || profile?.user_type !== 'admin') {
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [session, navigate]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats', selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_stats', {
        days_period: parseInt(selectedPeriod)
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user && session.user.email === ADMIN_EMAIL
  });

  if (!session || session.user.email !== ADMIN_EMAIL) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
          <div className="flex items-center gap-4">
            <CreateEmployeeDialog />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Trajets par jour</CardTitle>
              <CardDescription>
                Nombre de trajets créés sur les {selectedPeriod} derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RidesChart period={selectedPeriod} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gains de la plateforme</CardTitle>
              <CardDescription>
                Total des gains : {stats?.total_earnings || 0} crédits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EarningsChart period={selectedPeriod} />
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <CardDescription>
              Liste de tous les utilisateurs inscrits sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
