
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CreateEmployeeDialog from '@/components/admin/CreateEmployeeDialog';
import EarningsChart from '@/components/admin/EarningsChart';
import RidesChart from '@/components/admin/RidesChart';
import UsersTable from '@/components/admin/UsersTable';
import Navbar from '@/components/Navbar';

const AdminDashboard = () => {
  const { session } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_stats', {
        days_period: parseInt(selectedPeriod)
      });
      if (error) throw error;
      return data;
    }
  });

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
