
import { Link } from 'react-router-dom';
import { Car, Mail, User, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { session, signOut } = useAuth();

  const handleSignOut = () => {
    signOut.mutate();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary-100 text-primary-600">
                        {getInitials(session.user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem className="font-medium text-sm">
                    {session.user?.email}
                  </DropdownMenuItem>
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Mon Profil</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-primary-600 flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Connexion</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
