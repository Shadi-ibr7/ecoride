
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Driver } from '@/types/ride';

type DriverProfileProps = {
  driver: Driver;
};

const DriverProfile = ({ driver }: DriverProfileProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <img
            src={driver.photoUrl}
            alt={`Photo de ${driver.name}`}
            className="w-24 h-24 rounded-full object-cover border-2 border-primary-200"
          />
          <div>
            <h3 className="text-xl font-medium">{driver.name}</h3>
            <div className="flex items-center justify-center text-yellow-500 mt-1">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 text-lg">{driver.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverProfile;
