import { Customer } from '@/types';
import { TableCell, TableRow } from '../ui/table';
import { Delete } from 'lucide-react';
import { Button } from '../ui/button';

interface CustomerSummaryProps {
  customer: Customer;
  onSelect: (customer: Customer) => void;
  onDelete: (customerId: number) => void;
}

export default function CustomerSummary({
  customer,
  onSelect,
  onDelete,
}: CustomerSummaryProps) {
  return (
    <TableRow
      key={customer.id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onSelect(customer)}
    >
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
        <Button onClick={() => onDelete(customer.id)}>
          <Delete />
        </Button>
      </TableCell>
    </TableRow>
  );
}
