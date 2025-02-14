
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-4">EcoRide</h3>
            <p className="text-primary-100">
              Voyagez de manière écologique et économique grâce au covoiturage responsable.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Liens utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-100 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-primary-100 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-100 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <a
              href="mailto:contact@ecoride.fr"
              className="flex items-center text-primary-100 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              contact@ecoride.fr
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary-700 text-center text-primary-100">
          <p>&copy; {new Date().getFullYear()} EcoRide. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
