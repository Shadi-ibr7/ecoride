import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/auth/AuthForm';
type AuthProps = {
  type: 'login' | 'register';
};
const Auth = ({
  type
}: AuthProps) => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="page-container flex-1 flex items-center justify-center py-12 px-4 my-[60px]">
        <AuthForm type={type} />
      </main>
      <Footer />
    </div>;
};
export default Auth;