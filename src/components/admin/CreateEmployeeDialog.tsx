
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

const CreateEmployeeDialog = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    password: '',
    username: '',
    fullName: ''
  });

  const createEmployee = useMutation({
    mutationFn: async (employeeData: typeof newEmployee) => {
      const { data, error } = await supabase.rpc('create_employee_account', {
        p_email: employeeData.email,
        p_password: employeeData.password,
        p_username: employeeData.username,
        p_full_name: employeeData.fullName
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Compte employé créé avec succès');
      setNewEmployee({
        email: '',
        password: '',
        username: '',
        fullName: ''
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la création du compte', {
        description: error.message
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEmployee.mutate(newEmployee);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Créer un compte employé
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Créer un nouveau compte employé</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un compte employé
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={newEmployee.email}
                  onChange={e => setNewEmployee(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={newEmployee.password}
                  onChange={e => setNewEmployee(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Pseudo</Label>
                <Input
                  id="username"
                  placeholder="pseudo"
                  value={newEmployee.username}
                  onChange={e => setNewEmployee(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  placeholder="Nom et prénom"
                  value={newEmployee.fullName}
                  onChange={e => setNewEmployee(prev => ({
                    ...prev,
                    fullName: e.target.value
                  }))}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createEmployee.isPending}>
              {createEmployee.isPending ? 'Création...' : 'Créer le compte'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
