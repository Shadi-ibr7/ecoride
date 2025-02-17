
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-gray-50 pt-20 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-6xl font-playfair text-primary-900 text-center mb-6">
              Voyagez différemment avec <span className="text-primary-600">EcoRide</span>
            </h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Rejoignez notre communauté de covoiturage écologique et économique. Ensemble, réduisons notre empreinte carbone.
            </p>

            {/* Search Form */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                  <Input type="text" placeholder="Ville de départ" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
                  <Input type="text" placeholder="Ville d'arrivée" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <Input type="date" className="w-full" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
              </div>
              <Button className="w-full md:w-auto">Rechercher</Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-playfair text-primary-900 text-center mb-12">
              Votre partenaire pour une mobilité durable
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-gray-600">
                  EcoRide est né d'une vision simple : rendre le covoiturage plus accessible, plus écologique et plus convivial. Notre plateforme connecte des milliers de voyageurs partageant les mêmes valeurs environnementales.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-600">
                    <span className="text-primary-600 mr-2">✓</span>
                    Plus de 50 000 trajets partagés
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-primary-600 mr-2">✓</span>
                    -30% d'émissions de CO2
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-primary-600 mr-2">✓</span>
                    Communauté de 20 000 membres
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img src="/lovable-uploads/c3a2b3d8-7321-46a4-8b80-0e57136d12e4.png" alt="Nature" className="rounded-lg w-full h-48 object-cover" />
                <img src="/lovable-uploads/3562cb01-ff10-452b-9373-d02380b46f2f.png" alt="Montagne" className="rounded-lg w-full h-48 object-cover" />
                <img src="/lovable-uploads/0158ead8-0b36-4e72-b18e-84cd023e7671.png" alt="Animaux" className="rounded-lg w-full h-48 object-cover" />
                <img src="/lovable-uploads/f1401e95-3427-4c31-a31c-5f5bb0935fca.png" alt="Nature sauvage" className="rounded-lg w-full h-48 object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-playfair text-primary-900 text-center mb-12">
              Pourquoi choisir EcoRide ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary-600 text-2xl">$</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Économique</h3>
                <p className="text-gray-600">
                  Partagez les frais de transport et réduisez vos dépenses de déplacement.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary-600 text-2xl">♥</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Écologique</h3>
                <p className="text-gray-600">
                  Réduisez votre empreinte carbone en partageant votre trajet avec d'autres voyageurs.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary-600 text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Communautaire</h3>
                <p className="text-gray-600">
                  Rejoignez une communauté de voyageurs partageant les mêmes valeurs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
