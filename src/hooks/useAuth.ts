import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

const ADMIN_EMAIL = 'jose@gmail.com';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      return session;
    },
  });

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log('Tentative de connexion avec:', email);
      
      const { data: userExists, error: userCheckError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (userCheckError) {
        console.error('Erreur lors de la connexion:', userCheckError);
        if (userCheckError.message === "Invalid login credentials") {
          throw new Error("Email ou mot de passe incorrect");
        }
        throw userCheckError;
      }

      if (!userExists?.user?.id) {
        throw new Error("Impossible de récupérer l'utilisateur");
      }

      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userExists.user.id)
        .single();

      console.log('Profil existant:', existingProfile);

      if (profileError) throw profileError;

      if (!existingProfile && email === ADMIN_EMAIL) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userExists.user.id,
              user_type: 'admin',
              username: 'admin',
              full_name: 'Administrateur'
            }
          ])
          .select('user_type')
          .single();

        if (insertError) throw insertError;
        return { profile: newProfile, email };
      } else if (!existingProfile) {
        throw new Error("Profil utilisateur non trouvé");
      }

      if (email === ADMIN_EMAIL && existingProfile.user_type !== 'admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ user_type: 'admin' })
          .eq('id', userExists.user.id);

        if (updateError) throw updateError;
        return { profile: { user_type: 'admin' }, email };
      }

      return { profile: existingProfile, email };
    },
    onSuccess: ({ profile, email }) => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      toast.success("Connexion réussie");
      
      navigate('/');
      
      if (email === ADMIN_EMAIL || profile?.user_type === 'admin') {
        toast.info("Vous avez accès à l'espace administrateur et à l'espace employé", {
          duration: 5000
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la connexion", {
        description: error.message
      });
      console.error('Erreur de connexion:', error);
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
        options: {
          data: {
            username,
            full_name: fullName
          }
        }
      });
      
      if (signUpError) throw signUpError;

      if (!data?.user?.id) {
        throw new Error("Erreur lors de la création du compte");
      }

      const userType = email === ADMIN_EMAIL ? 'admin' : 'passenger';
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username,
            full_name: fullName,
            user_type: userType
          }
        ]);

      if (profileError) throw profileError;
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
    onError: (error: Error) => {
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
