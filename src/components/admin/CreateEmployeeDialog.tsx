import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail, Lock, User, UserCircle } from 'lucide-react';

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
    mutationFn: async (employeeData) => {
      const { data: existingUser } = await supabase.from('profiles').select('id').eq('email', employeeData.email).single();
      if (existingUser) throw new Error('Cet email est déjà utilisé');
      const { data, error } = await supabase.rpc('create_employee_account', employeeData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Compte employé créé avec succès');
      setNewEmployee({ email: '', password: '', username: '', fullName: '' });
      setOpen(false);
    },
    onError: (error) => toast.error('Erreur: ' + error.message)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createEmployee.mutate(newEmployee);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />Créer un compte employé
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full bg-white p-6 border shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Créer un compte employé</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['email', 'password', 'username', 'fullName'].map((field, index) => (
            <div key={index}>
              <Label htmlFor={field} className="flex items-center gap-2">
                {field === 'email' && <Mail className="h-4 w-4" />}
                {field === 'password' && <Lock className="h-4 w-4" />}
                {field === 'username' && <User className="h-4 w-4" />}
                {field === 'fullName' && <UserCircle className="h-4 w-4" />}
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input id={field} type={field === 'password' ? 'password' : 'text'} placeholder={field} value={newEmployee[field]} onChange={e => setNewEmployee(prev => ({ ...prev, [field]: e.target.value }))} required />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={createEmployee.isPending}>{createEmployee.isPending ? 'Création...' : 'Créer'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
