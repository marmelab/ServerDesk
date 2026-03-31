import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Customer } from '@/types';

interface DeleteCustomerDialogProps {
  customer: Customer | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
  isDeleting?: boolean;
}

export function DeleteCustomerDialog({
  customer,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteCustomerDialogProps) {
  return (
    <AlertDialog open={!!customer} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete customer account</AlertDialogTitle>
          <AlertDialogDescription className="text-tertiary">
            This will permanently delete the customer
            <span className="font-bold text-foreground"> {customer?.name}</span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => customer && onConfirm(customer.id)}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
