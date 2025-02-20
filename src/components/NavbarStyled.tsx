
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';

const NavbarStyled = () => {
  const isMobile = useMobile();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white to-primary-100 border-b border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">EcoRide</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/rides" className="text-gray-600 hover:text-primary-600 transition-colors">
                Trajets
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                Contact
              </Link>
              <div className="space-x-4">
                <Link to="/login">
                  <Button variant="outline">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button>Inscription</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarStyled;
