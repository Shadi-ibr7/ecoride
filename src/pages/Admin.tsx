import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
  });

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
    if (userProfile && userProfile.user_type !== 'admin') {
      navigate('/');
    }
  }, [userProfile, navigate]);

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userProfile && userProfile.user_type === 'admin',
  });

  const { data: ridesStats, isLoading: isLoadingRides } = useQuery({
    queryKey: ['rides-stats'],
    queryFn: async () => {
      const { data: rides, error } = await supabase
        .from('rides')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const stats = rides.reduce((acc: Record<string, number>, ride) => {
        const date = format(new Date(ride.created_at), 'dd/MM/yyyy');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(stats).map(([date, count]) => ({
        date,
        count,
      }));
    },
    enabled: !!userProfile && userProfile.user_type === 'admin',
  });

  const { data: earningsStats, isLoading: isLoadingEarnings } = useQuery({
    queryKey: ['earnings-stats'],
    queryFn: async () => {
      const { data: earnings, error } = await supabase
        .from('platform_earnings')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const stats = earnings.reduce((acc: Record<string, number>, earning) => {
        const date = format(new Date(earning.created_at), 'dd/MM/yyyy');
        acc[date] = (acc[date] || 0) + Number(earning.amount);
        return acc;
      }, {});

      return {
        byDate: Object.entries(stats).map(([date, amount]) => ({
          date,
          amount,
        })),
        total: earnings.reduce((sum, earning) => sum + Number(earning.amount), 0),
      };
    },
    enabled: !!userProfile && userProfile.user_type === 'admin',
  });

  const createEmployee = useMutation({
    mutationFn: async (employeeData: typeof newEmployee) => {
      const { data, error } = await supabase.rpc('create_employee_account', {
        email: employeeData.email,
        password: employeeData.password,
        username: employeeData.username,
        full_name: employeeData.fullName,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Compte employé créé avec succès');
      setNewEmployee({ email: '', password: '', username: '', fullName: '' });
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la création du compte', {
        description: error.message,
      });
    },
  });

  const toggleUserSuspension = useMutation({
    mutationFn: async ({ userId, isSuspended }: { userId: string; isSuspended: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: isSuspended })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Le statut du compte a été mis à jour');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la mise à jour du statut', {
        description: error.message,
      });
    },
  });

  if (isLoadingProfile) {
    return <div>Chargement...</div>;
  }

  if (!session || userProfile?.user_type !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Espace Administrateur</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Trajets par jour</CardTitle>
              <CardDescription>
                Nombre de trajets créés sur les 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoadingRides ? (
                <div>Chargement des statistiques...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ridesStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Nombre de trajets" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gains de la plateforme</CardTitle>
              <CardDescription>
                Total des gains : {earningsStats?.total || 0} crédits
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoadingEarnings ? (
                <div>Chargement des statistiques...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsStats?.byDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" name="Crédits gagnés" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Gérer les comptes utilisateurs et employés
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Créer un compte employé</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau compte employé</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations pour créer un compte employé
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newEmployee.password}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">Pseudo</Label>
                      <Input
                        id="username"
                        value={newEmployee.username}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input
                        id="fullName"
                        value={newEmployee.fullName}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => createEmployee.mutate(newEmployee)} disabled={createEmployee.isPending}>
                      {createEmployee.isPending ? 'Création...' : 'Créer le compte'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="py-3 px-4 text-left">Utilisateur</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left">Date de création</th>
                      <th className="py-3 px-4 text-left">Statut</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={5} className="py-4 px-4 text-center">
                          Chargement des utilisateurs...
                        </td>
                      </tr>
                    ) : users?.map((user) => (
                      <tr key={user.id}>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-gray-500">{user.full_name}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.user_type === 'admin' ? 'default' : 'secondary'}>
                            {user.user_type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {format(new Date(user.created_at), 'Pp', { locale: fr })}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.is_suspended ? 'destructive' : 'success'}>
                            {user.is_suspended ? 'Suspendu' : 'Actif'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            variant={user.is_suspended ? "default" : "destructive"}
                            size="sm"
                            onClick={() => toggleUserSuspension.mutate({ 
                              userId: user.id, 
                              isSuspended: !user.is_suspended 
                            })}
                            disabled={toggleUserSuspension.isPending}
                          >
                            {user.is_suspended ? 'Réactiver' : 'Suspendre'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
