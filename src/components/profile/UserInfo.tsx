
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { History } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

interface UserInfoProps {
  session: Session;
}

const UserInfo = ({ session }: UserInfoProps) => {
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="mb-8 text-center">
      <Avatar className="h-24 w-24 mx-auto mb-4">
        <AvatarFallback className="bg-primary-100 text-primary-600 text-2xl">
          {getInitials(session.user?.email)}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold text-gray-900">
        Mon Profil
      </h1>
      <p className="text-gray-600">{session.user?.email}</p>
      <Link to="/rides/history">
        <Button variant="outline" className="mt-4">
          <History className="w-4 h-4 mr-2" />
          Voir mon historique de trajets
        </Button>
      </Link>
    </div>
  );
};

export default UserInfo;

