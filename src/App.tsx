
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner"
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/AdminDashboard';
import EmployeeSpace from '@/pages/EmployeeSpace';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeSpace />} /> {/* Route pour l'espace employé */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
