
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Car, Mail } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + Lien Accueil */}
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-primary-600 font-playfair text-xl font-bold hover:text-primary-700 transition-colors">
                EcoRide
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              to="/rides" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors flex items-center"
            >
              <Car className="w-5 h-5 mr-1" />
              Covoiturages
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors flex items-center"
            >
              <Mail className="w-5 h-5 mr-1" />
              Contact
            </Link>
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors flex items-center"
            >
              <User className="w-5 h-5 mr-1" />
              Connexion
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
              aria-label="Menu principal"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white border-b border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/rides"
            className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Car className="w-5 h-5 mr-2" />
            Covoiturages
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact
          </Link>
          <Link
            to="/login"
            className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-5 h-5 mr-2" />
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
