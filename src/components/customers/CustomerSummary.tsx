import { Customer } from '@/types';
import { TableCell, TableRow } from '../ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface CustomerSummaryProps {
  customer: Customer;
  onDelete: (customerId: number) => void;
  onUpdate: (customer: Customer) => void;
}

export default function CustomerSummary({
  customer,
  onDelete,
  onUpdate,
}: CustomerSummaryProps) {
  return (
    <TableRow key={customer.id}>
      <TableCell className="font-medium">
        <div className="flex flex-col font-semibold">
          <span>{customer.name}</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{customer.email}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              onUpdate(customer);
            }}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-destructive/10 hover:text-destructive text-destructive"
            onClick={() => {
              onDelete(customer.id);
            }}
          >
            <Trash2 />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
