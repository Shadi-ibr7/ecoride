
import { Link } from 'react-router-dom';
import { Car, Mail, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-primary-600 font-playfair text-2xl font-bold">
              EcoRide
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              to="/rides" 
              className="text-gray-700 hover:text-primary-600 flex items-center space-x-2"
            >
              <Car className="w-5 h-5" />
              <span>Covoiturages</span>
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary-600 flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Contact</span>
            </Link>
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-primary-600 flex items-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>Connexion</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
