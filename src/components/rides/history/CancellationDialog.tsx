
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface CancellationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancellationDialog = ({ isOpen, onClose, onConfirm }: CancellationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir annuler ce trajet ? Cette action est irréversible et les passagers seront notifiés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirmer l'annulation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancellationDialog;
