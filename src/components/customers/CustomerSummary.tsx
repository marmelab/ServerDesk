import { Customer } from '@/types';
import { TableCell, TableRow } from '../ui/table';
import { Trash2 } from 'lucide-react';
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

  const handleUpdate = () => setSelectedCustomer(null);

  return (
    <TableRow
      key={customer.id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => setSelectedCustomer(customer)}
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
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(customer.id);
          }}
        >
          <Trash2 />
        </Button>
      </TableCell>
      {selectedCustomer && (
        <AddCustomerDialog
          companyId={selectedCustomer.company_id}
          initialCustomer={selectedCustomer}
          handleSubmit={handleUpdate}
        />
      )}
    </TableRow>
  );
}
