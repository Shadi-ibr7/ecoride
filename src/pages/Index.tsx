
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Index = () => {
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
};

export default Index;
