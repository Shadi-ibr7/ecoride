
import { Link } from 'react-router-dom';
import { Menu, X, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const NavbarStyled = () => {
  const isMobile = useIsMobile();
  const { session } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-primary-100 to-white border-b border-primary-200">
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
              {!session ? (
                <div className="space-x-4">
                  <Link to="/login">
                    <Button variant="outline">Connexion</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Inscription</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link to="/profile">
                    <Button variant="outline" className="flex items-center gap-2">
                      <UserRound size={18} />
                      Mon Profil
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="flex items-center gap-4">
              {session && (
                <Link to="/profile">
                  <Button variant="outline" size="icon">
                    <UserRound className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 top-[73px] bg-white z-50">
            <div className="flex flex-col items-center space-y-4 p-4">
              <Link 
                to="/rides" 
                className="text-gray-600 hover:text-primary-600 transition-colors w-full text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Trajets
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-600 hover:text-primary-600 transition-colors w-full text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {!session && (
                <>
                  <Link 
                    to="/login" 
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link 
                    to="/register" 
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full">
                      Inscription
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarStyled;
