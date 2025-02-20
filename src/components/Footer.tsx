
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-primary-100 to-white border-t border-primary-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>contact@ecoride.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>75001 Paris, France</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Liens rapides</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/rides" className="text-gray-600 hover:text-primary-600 transition-colors">
                Trajets disponibles
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                Nous contacter
              </Link>
              <Link to="/rides/create" className="text-gray-600 hover:text-primary-600 transition-colors">
                Proposer un trajet
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations légales</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/mentions-legales" className="text-gray-600 hover:text-primary-600 transition-colors">
                Mentions légales
              </Link>
              <Link to="/politique-confidentialite" className="text-gray-600 hover:text-primary-600 transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} EcoRide. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
