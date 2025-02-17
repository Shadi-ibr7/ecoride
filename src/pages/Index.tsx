
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <h1 className="text-7xl font-playfair text-primary-900 text-center mb-6 animate-fade-in">
              Voyagez différemment avec <span className="text-primary-600">EcoRide</span>
            </h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16 animate-fade-in opacity-0 [animation-delay:200ms]">
              Rejoignez notre communauté de covoiturage écologique et économique. Ensemble, réduisons notre empreinte carbone.
            </p>

            {/* Search Form */}
            <div className="max-w-5xl mx-auto glass p-8 rounded-2xl space-y-8 animate-fade-in opacity-0 [animation-delay:400ms]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Départ</label>
                  <Input 
                    type="text" 
                    placeholder="Ville de départ" 
                    className="w-full bg-white/60 backdrop-blur-sm border-gray-200 focus:border-primary-300 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Arrivée</label>
                  <Input 
                    type="text" 
                    placeholder="Ville d'arrivée" 
                    className="w-full bg-white/60 backdrop-blur-sm border-gray-200 focus:border-primary-300 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <Input 
                    type="date" 
                    className="w-full bg-white/60 backdrop-blur-sm border-gray-200 focus:border-primary-300 transition-all" 
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="lg" className="px-8 py-6 text-lg bg-primary-600 hover:bg-primary-700 transition-all duration-300">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-playfair text-primary-900 text-center mb-16 animate-fade-in">
              Votre partenaire pour une mobilité durable
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-in opacity-0 [animation-delay:200ms]">
                <p className="text-xl text-gray-600 leading-relaxed">
                  EcoRide est né d'une vision simple : rendre le covoiturage plus accessible, plus écologique et plus convivial. Notre plateforme connecte des milliers de voyageurs partageant les mêmes valeurs environnementales.
                </p>
                <ul className="space-y-6">
                  <li className="flex items-center text-lg text-gray-600">
                    <span className="text-primary-600 mr-3">✓</span>
                    Plus de 50 000 trajets partagés
                  </li>
                  <li className="flex items-center text-lg text-gray-600">
                    <span className="text-primary-600 mr-3">✓</span>
                    -30% d'émissions de CO2
                  </li>
                  <li className="flex items-center text-lg text-gray-600">
                    <span className="text-primary-600 mr-3">✓</span>
                    Communauté de 20 000 membres
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-6 animate-fade-in opacity-0 [animation-delay:400ms]">
                <img src="/lovable-uploads/4001eaa1-514c-474b-923a-004653947bdb.png" alt="Paysage montagneux" className="rounded-2xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
                <img src="/lovable-uploads/4c3200ab-fb7a-4a89-b895-72f6880cafd3.png" alt="Nature préservée" className="rounded-2xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
                <img src="/lovable-uploads/0158ead8-0b36-4e72-b18e-84cd023e7671.png" alt="Faune sauvage" className="rounded-2xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
                <img src="/lovable-uploads/f1401e95-3427-4c31-a31c-5f5bb0935fca.png" alt="Paysage naturel" className="rounded-2xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-playfair text-primary-900 text-center mb-16 animate-fade-in">
              Pourquoi choisir EcoRide ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 animate-fade-in opacity-0 [animation-delay:200ms]">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary-600 text-3xl">$</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Économique</h3>
                <p className="text-gray-600">
                  Partagez les frais de transport et réduisez vos dépenses de déplacement.
                </p>
              </div>
              <div className="glass p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 animate-fade-in opacity-0 [animation-delay:400ms]">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary-600 text-3xl">♥</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Écologique</h3>
                <p className="text-gray-600">
                  Réduisez votre empreinte carbone en partageant votre trajet avec d'autres voyageurs.
                </p>
              </div>
              <div className="glass p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 animate-fade-in opacity-0 [animation-delay:600ms]">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary-600 text-3xl">👥</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Communautaire</h3>
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
