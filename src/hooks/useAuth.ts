
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      toast.success("Connexion réussie");
      navigate('/');
    },
    onError: (error) => {
      toast.error("Erreur lors de la connexion", {
        description: error.message
      });
    },
  });

  const signUp = useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      username, 
      fullName 
    }: { 
      email: string; 
      password: string; 
      username: string; 
      fullName: string;
    }) => {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            full_name: fullName,
          });

        if (profileError) throw profileError;
      }
    },
    onSuccess: () => {
      toast.success("Compte créé avec succès", {
        description: "Veuillez vérifier votre email pour confirmer votre compte."
      });
      navigate('/login');
    },
    onError: (error: any) => {
      if (error.message?.includes('User already registered') || error.message?.includes('user_already_exists')) {
        toast.error("Erreur lors de la création du compte", {
          description: "Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse."
        });
      } else {
        toast.error("Erreur lors de la création du compte", {
          description: error.message
        });
      }
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.clear();
      toast.success("Déconnexion réussie");
      navigate('/');
    },
    onError: (error) => {
      toast.error("Erreur lors de la déconnexion", {
        description: error.message
      });
    },
  });

  return {
    session,
    signIn,
    signUp,
    signOut,
  };
};
