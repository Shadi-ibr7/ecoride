
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { session } = useAuth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-4">Bienvenue sur notre plateforme de covoiturage</h1>
        <p className="text-gray-600 text-center">
          Veuillez vous connecter pour accéder à votre espace utilisateur.
        </p>
      </div>
    );
  }

  return <UserProfileForm />;
};

export default Index;
