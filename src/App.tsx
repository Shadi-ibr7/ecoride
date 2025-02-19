
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AdminDashboard from "@/pages/AdminDashboard";
import UserProfile from "@/pages/UserProfile";
import CreateRide from "@/pages/CreateRide";
import RideDetails from "@/pages/RideDetails";
import RideHistory from "@/pages/RideHistory";
import Rides from "@/pages/Rides";
import NotFound from "@/pages/NotFound";
import Contact from "@/pages/Contact";
import EmployeeSpace from "@/pages/EmployeeSpace";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Auth type="login" />} />
      <Route path="/register" element={<Auth type="register" />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/rides/create" element={<CreateRide />} />
      <Route path="/rides/:id" element={<RideDetails />} />
      <Route path="/rides/history" element={<RideHistory />} />
      <Route path="/rides" element={<Rides />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/employee" element={<EmployeeSpace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
