
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { Heart, DollarSign, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-[#1B4332] text-center mb-6">
            Voyagez différemment avec <span className="text-primary-600">EcoRide</span>
          </h1>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 text-lg">
            Rejoignez notre communauté de covoiturage écologique et économique. Ensemble, réduisons notre empreinte carbone.
          </p>
          <SearchBar onSearch={params => console.log(params)} />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1B4332] mb-6">
              Votre partenaire pour une mobilité durable
            </h2>
            <p className="text-gray-600 mb-8">
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
            <img 
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=60" 
              alt="Voiture électrique moderne" 
              className="rounded-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60" 
              alt="Borne de recharge électrique" 
              className="rounded-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1617886903355-8665577a22c7?w=800&auto=format&fit=crop&q=60" 
              alt="Intérieur voiture électrique" 
              className="rounded-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1611516818236-0531e459c047?w=800&auto=format&fit=crop&q=60" 
              alt="Station de recharge verte" 
              className="rounded-lg w-full h-48 object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#1B4332] text-center mb-12">
            Pourquoi choisir EcoRide ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Économique</h3>
              <p className="text-gray-600">
                Partagez les frais de transport et réduisez vos dépenses de déplacement.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Écologique</h3>
              <p className="text-gray-600">
                Réduisez votre empreinte carbone en partageant votre trajet avec d'autres voyageurs.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Communautaire</h3>
              <p className="text-gray-600">
                Rejoignez une communauté de voyageurs partageant les mêmes valeurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
