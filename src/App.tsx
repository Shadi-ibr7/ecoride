
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
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
import MentionsLegales from "@/pages/MentionsLegales";
import PolitiqueConfidentialite from "@/pages/PolitiqueConfidentialite";

function App() {
  return (
    <>
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
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
