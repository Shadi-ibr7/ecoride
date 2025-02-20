
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import DriverRides from '@/components/rides/history/DriverRides';
import PassengerRides from '@/components/rides/history/PassengerRides';
import CancellationDialog from '@/components/rides/history/CancellationDialog';
import { Card, CardContent } from "@/components/ui/card";

const RideHistory = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [rideToCancel, setRideToCancel] = useState<string | null>(null);

  const { data: rides, isLoading } = useQuery({
    queryKey: ['rides-history', session?.user?.id],
    queryFn: async () => {
      const { data: driverRides, error: driverError } = await supabase
        .from('rides')
        .select(`
          *,
          ride_bookings (
            id,
            passenger_id,
            booking_status,
            created_at,
            cancelled_at
          )
        `)
        .eq('driver_id', session?.user?.id);
      if (driverError) throw driverError;

      const { data: passengerRides, error: passengerError } = await supabase
        .from('ride_bookings')
        .select(`
          *,
          rides (
            *,
            profiles:driver_id (
              full_name
            )
          )
        `)
        .eq('passenger_id', session?.user?.id);
      if (passengerError) throw passengerError;

      return {
        asDriver: driverRides || [],
        asPassenger: passengerRides || []
      };
    },
    enabled: !!session?.user?.id
  });

  const cancelRide = useMutation({
    mutationFn: async (rideId: string) => {
      const { error } = await supabase
        .from('rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides-history'] });
      toast.success('Trajet annulé avec succès');
      setRideToCancel(null);
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de l\'annulation', { description: error.message });
    }
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            Chargement de l'historique...
          </CardContent>
        </Card>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <DriverRides
          rides={rides?.asDriver || []}
          onCancelRide={(rideId) => setRideToCancel(rideId)}
        />
        <PassengerRides
          bookings={rides?.asPassenger || []}
        />
      </div>

      <CancellationDialog
        isOpen={!!rideToCancel}
        onClose={() => setRideToCancel(null)}
        onConfirm={() => rideToCancel && cancelRide.mutate(rideToCancel)}
      />
    </div>
  );
};

export default RideHistory;
