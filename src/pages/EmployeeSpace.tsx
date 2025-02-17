
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const EmployeeSpace = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Vérifier que l'utilisateur est bien un employé
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Rediriger si l'utilisateur n'est pas un employé
  useEffect(() => {
    if (userProfile && userProfile.user_type !== 'employee') {
      navigate('/');
    }
  }, [userProfile, navigate]);

  // Récupérer les avis en attente de validation
  const { data: pendingReviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['pending-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ride_validations')
        .select(`
          *,
          booking:ride_bookings (
            id,
            passenger:profiles!ride_bookings_passenger_id_fkey (
              username,
              auth_users (
                email
              )
            ),
            ride:rides (
              id,
              departure_address,
              arrival_address,
              departure_time,
              arrival_time,
              driver:profiles!rides_driver_id_fkey (
                username,
                auth_users (
                  email
                )
              )
            )
          )
        `)
        .eq('validation_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && userProfile?.user_type === 'employee',
  });

  // Récupérer les trajets problématiques
  const { data: problematicRides, isLoading: isLoadingProblematic } = useQuery({
    queryKey: ['problematic-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ride_validations')
        .select(`
          *,
          booking:ride_bookings (
            id,
            passenger:profiles!ride_bookings_passenger_id_fkey (
              username,
              auth_users (
                email
              )
            ),
            ride:rides (
              id,
              departure_address,
              arrival_address,
              departure_time,
              arrival_time,
              driver:profiles!rides_driver_id_fkey (
                username,
                auth_users (
                  email
                )
              )
            )
          )
        `)
        .eq('is_validated', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && userProfile?.user_type === 'employee',
  });

  // Mutation pour valider ou refuser un avis
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
      toast.success('Statut de l\'avis mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la mise à jour du statut', {
        description: error.message
      });
    },
  });

  if (isLoadingProfile) {
    return <div>Chargement...</div>;
  }

  if (!session || userProfile?.user_type !== 'employee') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Espace Employé</h1>

        <Tabs defaultValue="reviews" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reviews">Avis en attente</TabsTrigger>
            <TabsTrigger value="problems">Trajets problématiques</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Avis en attente de validation</CardTitle>
                <CardDescription>
                  Validez ou refusez les avis des utilisateurs avant leur publication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingReviews ? (
                    <p>Chargement des avis...</p>
                  ) : pendingReviews?.length === 0 ? (
                    <p className="text-gray-500">Aucun avis en attente de validation</p>
                  ) : (
                    pendingReviews?.map((review) => (
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
          </TabsContent>

          <TabsContent value="problems">
            <Card>
              <CardHeader>
                <CardTitle>Trajets problématiques</CardTitle>
                <CardDescription>
                  Liste des trajets signalés comme problématiques par les utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingProblematic ? (
                    <p>Chargement des trajets problématiques...</p>
                  ) : problematicRides?.length === 0 ? (
                    <p className="text-gray-500">Aucun trajet problématique signalé</p>
                  ) : (
                    problematicRides?.map((issue) => (
                      <Card key={issue.id} className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="destructive" className="mb-2">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Problème signalé
                              </Badge>
                              <h3 className="font-semibold">
                                Trajet #{issue.booking.ride.id}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {issue.booking.ride.departure_address} → {issue.booking.ride.arrival_address}
                              </p>
                              <p className="text-sm text-gray-600">
                                Le {format(new Date(issue.booking.ride.departure_time), 'PPP', { locale: fr })}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Conducteur</h4>
                              <p className="text-sm">
                                Pseudo : {issue.booking.ride.driver.username}
                              </p>
                              <p className="text-sm">
                                Email : {issue.booking.ride.driver.auth_users?.[0]?.email}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Passager</h4>
                              <p className="text-sm">
                                Pseudo : {issue.booking.passenger.username}
                              </p>
                              <p className="text-sm">
                                Email : {issue.booking.passenger.auth_users?.[0]?.email}
                              </p>
                            </div>
                          </div>

                          {issue.comment && (
                            <div>
                              <h4 className="font-medium mb-2">Description du problème</h4>
                              <p className="text-sm text-gray-700">{issue.comment}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeSpace;
