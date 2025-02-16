
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <AuthForm />
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
