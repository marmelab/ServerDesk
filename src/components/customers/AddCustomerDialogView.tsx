import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { FilePlus } from 'lucide-react';
import { Button } from './../ui/button';
import { TextField } from '@/components/FormInputs';

interface AddCustomerDialogViewProps {
  form: any;
  isUpdate: boolean;
  handleSubmit?: any;
}

export default function AddCustomerDialogView({
  form,
  isUpdate,
  handleSubmit,
}: AddCustomerDialogViewProps) {
  const [isOpen, setIsOpen] = useState<boolean>(isUpdate);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isUpdate && (
        <DialogTrigger asChild>
          <Button className="group-hover:bg-primary group-hover:text-primary-foreground w-fit">
            <FilePlus className="ms-2 size-4" />
            {isUpdate ? 'Update Customer' : 'Add Customer'}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
            setIsOpen(false);
            handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {isUpdate ? 'Update Customer' : 'Add a new customer'}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-tertiary pt-1">
            Fill the informations of the customer.
          </DialogDescription>
          <div className="space-y-4">
            <form.Field name="name">
              {(field: any) => <TextField label="Name" field={field} />}
            </form.Field>
            <form.Field name="email">
              {(field: any) => <TextField label="Email" field={field} />}
            </form.Field>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="submit" disabled={form.state.isSubmitting}>
              {isUpdate ? 'Update Customer' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
