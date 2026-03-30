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

interface AddCustomerDialogViewProps {
  form: any;
}

export default function AddCustomerDialogView({
  form,
}: AddCustomerDialogViewProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="group-hover:bg-primary group-hover:text-primary-foreground w-fit">
          <FilePlus className="ms-2 size-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Add a new customer
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground pt-1">
            Fill the informations of the customer.
          </DialogDescription>
          <div className="space-y-4">
            <form.Field name="name">
              {(field: any) => <field.TextField label="Name" field={field} />}
            </form.Field>
            <form.Field name="email">
              {(field: any) => (
                <field.TextAreaField label="Email" field={field} />
              )}
            </form.Field>
          </div>
          <DialogFooter className="sm:justify-start">
            <form.AppForm>
              <form.SubmitButton form={form}>Add Customer</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
