
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';

type NoRidesFoundProps = {
  nearestRideDate: string | null;
};

const NoRidesFound = ({ nearestRideDate }: NoRidesFoundProps) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
        <AlertCircle className="w-5 h-5 mr-2" />
        <div>
          <p>Aucun trajet disponible pour cette date.</p>
          {nearestRideDate && (
            <p className="mt-2">
              Premier trajet disponible le{' '}
              {format(new Date(nearestRideDate), 'PPP', { locale: fr })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoRidesFound;
