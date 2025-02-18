
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import RidesChart from '@/components/admin/RidesChart';
import EarningsChart from '@/components/admin/EarningsChart';
import UsersTable from '@/components/admin/UsersTable';
import { toast } from "sonner";

const ADMIN_EMAIL = 'jose@gmail.com';
const ADMIN_PASSWORD = 'Azerty1234!';

const Admin = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const createAdminAccount = useMutation({
    mutationFn: async () => {
      try {
        // Créer l'utilisateur
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });

        if (signUpError) throw signUpError;

        if (!user) throw new Error('Erreur lors de la création de l\'utilisateur');

        // Mettre à jour le type en admin
        const { error: adminError } = await supabase.rpc('set_admin_user_type', {
          user_id: user.id
        });

        if (adminError) throw adminError;

        return user;
      } catch (error) {
        console.error('Erreur:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Compte administrateur créé avec succès", {
        description: "Vous pouvez maintenant vous connecter avec les identifiants administrateur."
      });
      setIsCreatingAdmin(false);
    },
    onError: (error: Error) => {
      console.error('Erreur création admin:', error);
      toast.error("Erreur lors de la création du compte admin", {
        description: error.message
      });
      setIsCreatingAdmin(false);
    }
  });

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();

      if (profileError) throw profileError;

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      return {
        ...profile,
        email: user?.email
      };
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (userProfile && (userProfile.email !== ADMIN_EMAIL || userProfile.user_type !== 'admin')) {
      navigate('/');
    }
  }, [userProfile, navigate]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    await createAdminAccount.mutateAsync();
  };

  // Si aucun admin n'existe, afficher le bouton de création
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Administrative</h1>
          <p className="text-gray-600 mb-4">Aucun administrateur n'est configuré.</p>
          <Button 
            onClick={handleCreateAdmin}
            disabled={isCreatingAdmin}
          >
            {isCreatingAdmin ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Créer le compte administrateur"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (userProfile.email !== ADMIN_EMAIL || userProfile.user_type !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Vous n'avez pas les droits d'accès à cette page.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Retourner à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Espace Administrateur</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RidesChart />
          <EarningsChart />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <UsersTable />
        </div>
      </div>
    </div>
  );
};

export default Admin;
