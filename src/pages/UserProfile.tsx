
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import UserInfo from '@/components/profile/UserInfo';
import UserTypeSelector from '@/components/profile/UserTypeSelector';
import VehicleManagement from '@/components/profile/VehicleManagement';
import DriverPreferences from '@/components/profile/DriverPreferences';
import type { Database } from '@/types/database.types';
type UserType = NonNullable<Database['public']['Tables']['profiles']['Row']['user_type']>;

const UserProfile = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { profile, updateProfile, isLoading } = useProfile(session?.user?.id);

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  if (!session || isLoading) {
    return null;
  }

  const handleUserTypeChange = async (value: UserType) => {
    try {
      await updateProfile.mutateAsync({
        user_type: value
      });
      toast.success('Type d\'utilisateur mis à jour');
    } catch (error) {
      console.error('Error updating user type:', error);
      toast.error('Erreur lors de la mise à jour du type d\'utilisateur');
    }
  };

  const showDriverComponents = profile?.user_type === 'driver' || profile?.user_type === 'both';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 bg-gray-50 my-[80px]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserInfo session={session} />

          <div className="space-y-6">
            <UserTypeSelector 
              userType={profile?.user_type || 'passenger'} 
              onUserTypeChange={handleUserTypeChange} 
            />

            {showDriverComponents && (
              <>
                <VehicleManagement />
                <DriverPreferences />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
