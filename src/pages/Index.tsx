
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { session } = useAuth();
  const { profile } = useUserProfile();

  // Si l'utilisateur n'est pas connecté, afficher la page d'accueil
  if (!session) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Bienvenue sur EcoRide
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Rejoignez notre communauté de covoiturage écologique et économique. 
              Voyagez de manière plus intelligente, plus économique et plus respectueuse de l'environnement.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/register">S'inscrire</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Se connecter</Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Si l'utilisateur est connecté mais n'a pas encore rempli son profil
  if (!profile?.username || !profile?.full_name) {
    return <UserProfileForm />;
  }

  // Si l'utilisateur est connecté et a un profil complet, rediriger vers les trajets
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Tableau de bord</h2>
          <div className="grid gap-6">
            <Button asChild size="lg" className="w-full">
              <Link to="/rides">Voir les trajets disponibles</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
