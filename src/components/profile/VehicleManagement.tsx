
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import VehicleForm from './VehicleForm';
import VehicleList from './VehicleList';
import { Plus } from 'lucide-react';

const VehicleManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des véhicules et trajets</h2>
        <Button
          onClick={() => navigate('/rides/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Créer un trajet
        </Button>
      </div>
      <VehicleList />
      <VehicleForm />
    </div>
  );
};

export default VehicleManagement;
