
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UsersTable from "@/components/admin/UsersTable";
import RidesChart from "@/components/admin/RidesChart";
import EarningsChart from "@/components/admin/EarningsChart";

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Tableau de bord
          </h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
            <RidesChart />
            <EarningsChart />
          </div>

          <div className="mt-8">
            <UsersTable />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
