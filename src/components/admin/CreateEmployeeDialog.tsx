
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CreateEmployeeDialog = () => {
  const queryClient = useQueryClient();
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
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

  return (
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
          <Button 
            onClick={() => createEmployee.mutate(newEmployee)} 
            disabled={createEmployee.isPending}
          >
            {createEmployee.isPending ? 'Création...' : 'Créer le compte'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
