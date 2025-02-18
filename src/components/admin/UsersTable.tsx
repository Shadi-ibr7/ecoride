
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CreateEmployeeDialog from './CreateEmployeeDialog';

const UsersTable = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Gérer les comptes utilisateurs et employés
          </CardDescription>
        </div>
        <CreateEmployeeDialog />
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
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
  );
};

export default UsersTable;
