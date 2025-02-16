
import RideCard from '@/components/RideCard';
import type { Ride } from '@/types/ride';

type RidesListProps = {
  rides: Ride[];
  from: string;
  to: string;
};

const RidesList = ({ rides, from, to }: RidesListProps) => {
  return (
    <div className="md:col-span-3 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {rides.length} trajet{rides.length > 1 ? 's' : ''} disponible{rides.length > 1 ? 's' : ''} de {from} à {to}
      </h2>
      {rides.map(ride => (
        <RideCard key={ride.id} ride={ride} />
      ))}
    </div>
  );
};

export default RidesList;
