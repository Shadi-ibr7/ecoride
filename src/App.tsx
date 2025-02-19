
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Rides from '@/pages/Rides';
import RideDetails from '@/pages/RideDetails';
import CreateRide from '@/pages/CreateRide';
import RideHistory from '@/pages/RideHistory';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/AdminDashboard';
import EmployeeSpace from '@/pages/EmployeeSpace';
import Contact from '@/pages/Contact';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/rides/:id" element={<RideDetails />} />
          <Route path="/rides/create" element={<CreateRide />} />
          <Route path="/rides/history" element={<RideHistory />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Admin />} />
          <Route path="/admin/employee" element={<EmployeeSpace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
