
import { Car } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Vehicle } from '@/types/ride';

type VehicleInfoProps = {
  vehicle: Vehicle;
};

const VehicleInfo = ({ vehicle }: VehicleInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Véhicule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Car className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
            <p className="text-sm text-gray-600">Énergie : {vehicle.energyType}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInfo;
