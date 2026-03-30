import { Customer } from '@/types';
import { TableCell, TableRow } from '../ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import AddCustomerDialog from './AddCustomerDialog';

interface CustomerSummaryProps {
  customer: Customer;
  onDelete: (customerId: number) => void;
}

export default function CustomerSummary({
  customer,
  onDelete,
}: CustomerSummaryProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  return (
    <TableRow key={customer.id}>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{customer.name}</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{customer.email}</span>
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          className="hover:bg-destructive/10 hover:text-destructive text-destructive"
          onClick={() => {
            onDelete(customer.id);
          }}
        >
          <Trash2 />
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            setSelectedCustomer(customer);
          }}
        >
          <Pencil />
        </Button>
      </TableCell>
      {selectedCustomer && (
        <AddCustomerDialog
          companyId={selectedCustomer.company_id}
          initialCustomer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </TableRow>
  );
}
