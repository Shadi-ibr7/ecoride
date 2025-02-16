
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary-100 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="h1 text-primary-800 mb-6 animate-in">
            Voyagez différemment avec
            <span className="text-primary-600"> EcoRide</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-in">
            Rejoignez notre communauté de covoiturage écologique et économique.
            Ensemble, réduisons notre empreinte carbone.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Présentation Section */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-in">
              <h2 className="h2 text-primary-800">
                Votre partenaire pour une mobilité durable
              </h2>
              <p className="text-lg text-gray-600">
                EcoRide est né d'une vision simple : rendre le covoiturage plus accessible, plus écologique et plus convivial. Notre plateforme connecte des milliers de voyageurs partageant les mêmes valeurs environnementales.
              </p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Plus de 50 000 trajets partagés
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  -30% d'émissions de CO2
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Communauté de 20 000 membres
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b"
                alt="Nature verdoyante" 
                className="rounded-xl object-cover w-full h-48 animate-in glass"
                style={{ animationDelay: '200ms' }}
              />
              <img 
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027"
                alt="Route pittoresque"
                className="rounded-xl object-cover w-full h-48 animate-in glass"
                style={{ animationDelay: '400ms' }}
              />
              <img 
                src="https://images.unsplash.com/photo-1438565434616-3ef039228b15"
                alt="Aventure en montagne"
                className="rounded-xl object-cover w-full h-48 animate-in glass"
                style={{ animationDelay: '600ms' }}
              />
              <img 
                src="https://images.unsplash.com/photo-1466721591366-2d5fba72006d"
                alt="Voyage en nature"
                className="rounded-xl object-cover w-full h-48 animate-in glass"
                style={{ animationDelay: '800ms' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="h2 text-center text-primary-800 mb-12">
            Pourquoi choisir EcoRide ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass p-6 rounded-xl text-center animate-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Données des features
const features = [
  {
    title: "Économique",
    description: "Partagez les frais de transport et réduisez vos dépenses de déplacement.",
    icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Écologique",
    description: "Réduisez votre empreinte carbone en partageant votre trajet avec d'autres voyageurs.",
    icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    title: "Communautaire",
    description: "Rejoignez une communauté de voyageurs partageant les mêmes valeurs.",
    icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
];

export default Index;
