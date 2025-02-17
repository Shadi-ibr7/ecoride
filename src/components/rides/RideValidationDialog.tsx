
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RideValidationForm {
  isValidated: boolean;
  comment?: string;
  rating?: number;
}

interface RideValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RideValidationForm) => void;
  isSubmitting: boolean;
}

const RideValidationDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting
}: RideValidationDialogProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const { register, handleSubmit, setValue, watch } = useForm<RideValidationForm>({
    defaultValues: {
      isValidated: true
    }
  });
  const isValidated = watch('isValidated', true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Validation du trajet</DialogTitle>
          <DialogDescription>
            Merci de nous indiquer si le trajet s'est bien passé
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant={isValidated ? "default" : "outline"}
                onClick={() => setValue('isValidated', true)}
              >
                Le trajet s'est bien passé
              </Button>
              <Button
                type="button"
                variant={!isValidated ? "destructive" : "outline"}
                onClick={() => setValue('isValidated', false)}
              >
                J'ai rencontré un problème
              </Button>
            </div>

            {isValidated && (
              <div className="space-y-2">
                <Label>Note</Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant="ghost"
                      className={`p-2 ${selectedRating >= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      onClick={() => {
                        setSelectedRating(rating);
                        setValue('rating', rating);
                      }}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="comment">
                {isValidated ? 'Commentaire (optionnel)' : 'Décrivez le problème rencontré'}
              </Label>
              <Textarea
                id="comment"
                placeholder={isValidated ? "Partagez votre expérience..." : "Que s'est-il passé ?"}
                {...register('comment')}
                required={!isValidated}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RideValidationDialog;
