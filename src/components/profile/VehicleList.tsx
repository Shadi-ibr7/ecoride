
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VehicleList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes véhicules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Aucun véhicule enregistré
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleList;

