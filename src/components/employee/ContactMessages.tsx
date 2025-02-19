
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import { Badge } from "@/components/ui/badge";
import { Session } from '@supabase/supabase-js';

interface ContactMessagesProps {
  messages: any[];
  isLoading: boolean;
  session: Session | null;
}

const ContactMessages = ({ messages, isLoading, session }: ContactMessagesProps) => {
  const queryClient = useQueryClient();

  const updateMessageStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status,
          processed_by: session?.user?.id
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast.success('Statut du message mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la mise à jour du statut', {
        description: error.message
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages de contact</CardTitle>
        <CardDescription>
          Messages reçus via le formulaire de contact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Chargement des messages...</p>
          ) : messages?.length === 0 ? (
            <p className="text-gray-500">Aucun message reçu</p>
          ) : (
            messages?.map((message) => (
              <Card key={message.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {message.first_name} {message.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{message.email}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(message.created_at), 'PPP', { locale: fr })}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        message.status === 'processed' 
                          ? 'default' 
                          : message.status === 'archived' 
                          ? 'secondary' 
                          : 'destructive'
                      }
                    >
                      {message.status === 'processed' 
                        ? 'Traité' 
                        : message.status === 'archived' 
                        ? 'Archivé' 
                        : 'En attente'}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Objet</h4>
                    <p className="text-gray-700">{message.subject}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Message</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                  </div>

                  {message.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateMessageStatus.mutate({ 
                          id: message.id, 
                          status: 'processed' 
                        })}
                      >
                        Marquer comme traité
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateMessageStatus.mutate({ 
                          id: message.id, 
                          status: 'archived' 
                        })}
                      >
                        Archiver
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactMessages;
