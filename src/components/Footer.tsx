
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
          <div className="px-5 py-2">
            <Link to="/contact" className="text-gray-600 hover:text-primary-600">
              Contact
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link to="/mentions-legales" className="text-gray-600 hover:text-primary-600">
              Mentions légales
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link to="/politique-confidentialite" className="text-gray-600 hover:text-primary-600">
              Politique de confidentialité
            </Link>
          </div>
        </nav>
        <p className="mt-8 text-center text-gray-500">
          © 2024 EcoRide. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
