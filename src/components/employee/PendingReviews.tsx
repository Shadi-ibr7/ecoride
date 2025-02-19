
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PendingReviewsProps {
  reviews: any[];
  isLoading: boolean;
}

const PendingReviews = ({ reviews, isLoading }: PendingReviewsProps) => {
  const queryClient = useQueryClient();

  const updateReviewStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('ride_validations')
        .update({ validation_status: status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] });
      toast.success("Statut de l'avis mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la mise à jour du statut", {
        description: error.message
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avis en attente de validation</CardTitle>
        <CardDescription>
          Validez ou refusez les avis des utilisateurs avant leur publication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Chargement des avis...</p>
          ) : reviews?.length === 0 ? (
            <p className="text-gray-500">Aucun avis en attente de validation</p>
          ) : (
            reviews?.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        De {review.booking.passenger.username}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Pour le trajet {review.booking.ride.departure_address} → {review.booking.ride.arrival_address}
                      </p>
                      <p className="text-sm">
                        Le {format(new Date(review.booking.ride.departure_time), 'PPP', { locale: fr })}
                      </p>
                      {review.rating && (
                        <p className="text-sm">Note : {review.rating}/5</p>
                      )}
                      {review.comment && (
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => updateReviewStatus.mutate({ id: review.id, status: 'approved' })}
                        disabled={updateReviewStatus.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Valider
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateReviewStatus.mutate({ id: review.id, status: 'rejected' })}
                        disabled={updateReviewStatus.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Refuser
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingReviews;
