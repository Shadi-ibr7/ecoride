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
import { toast } from "sonner";

const ADMIN_EMAIL = 'jose@gmail.com';

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user) {
        navigate('/login');
        return;
      }
      if (session.user.email !== ADMIN_EMAIL) {
        toast.error("Accès non autorisé");
        navigate('/');
        return;
      }
      try {
        const { data: profile, error } = await supabase.from('profiles').select('user_type').eq('id', session.user.id).maybeSingle();
        if (!profile && session.user.email === ADMIN_EMAIL) {
          const { error: createError } = await supabase.from('profiles').insert([
            { id: session.user.id, user_type: 'admin', username: 'admin', full_name: 'Administrateur' }
          ]);
          if (createError) {
            toast.error("Erreur lors de la création du profil administrateur");
            navigate('/');
            return;
          }
        } else if (profile?.user_type !== 'admin') {
          toast.error("Accès non autorisé");
          navigate('/');
          return;
        }
        setIsCheckingAdmin(false);
      } catch (error) {
        toast.error("Erreur lors de la vérification des droits administrateur");
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
    enabled: !!session?.user && session.user.email === ADMIN_EMAIL && !isCheckingAdmin
  });

  if (!session || session.user.email !== ADMIN_EMAIL) {
    return null;
  }
  if (isLoading || isCheckingAdmin) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-[120px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsFormOpen(true)} className="btn-primary">
              Ajouter un employé
            </button>
          </div>
        </div>

        {isFormOpen && <CreateEmployeeDialog open={isFormOpen} onClose={() => setIsFormOpen(false)} />}

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
    </div>;
};
export default AdminDashboard;
