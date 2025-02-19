import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/AdminDashboard';
import EmployeeSpace from '@/pages/EmployeeSpace';
import { Toaster } from "sonner"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeSpace />} /> {/* Ajout de la route employé */}
      </Routes>
      <Toaster />
    </>
  );
}
