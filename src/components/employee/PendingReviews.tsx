
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle2, XCircle, Star } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Chargement des avis...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">Aucun avis en attente de validation</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {reviews.map((review) => (
        <Card key={review.id} className="bg-white shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold text-primary-700">
                  Avis de {review.booking.passenger.username}
                </CardTitle>
                <CardDescription>
                  Pour le trajet #{review.booking.ride.id}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-primary-100 px-2 py-1 rounded">
                <Star className="w-4 h-4 text-primary-600 fill-current" />
                <span className="font-medium">{review.rating}/5</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Trajet</p>
                <p className="font-medium">
                  {review.booking.ride.departure_address} → {review.booking.ride.arrival_address}
                </p>
                <p className="text-sm text-gray-500">
                  Le {format(new Date(review.booking.ride.departure_time), 'PPP', { locale: fr })}
                </p>
              </div>

              {review.comment && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Commentaire</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {review.comment}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1"
                  onClick={() => updateReviewStatus.mutate({ id: review.id, status: 'approved' })}
                  disabled={updateReviewStatus.isPending}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Valider
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => updateReviewStatus.mutate({ id: review.id, status: 'rejected' })}
                  disabled={updateReviewStatus.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Refuser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingReviews;
