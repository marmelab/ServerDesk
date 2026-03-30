import { Customer } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CustomerSummary from '@/components/customers/CustomerSummary';
import React from 'react';

interface CustomersViewProps {
  customers: Customer[];
  isPlaceholderData: boolean;
  onDeleteCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  renderCustomerDialog: () => React.ReactNode;
}

export default function CustomersView({
  customers,
  isPlaceholderData,
  onDeleteCustomer,
  onUpdateCustomer,
  renderCustomerDialog,
}: CustomersViewProps) {
  return (
    <div>
      <PageHeader
        title="Customers"
        description="View and manage all customers."
      >
        {renderCustomerDialog()}
      </PageHeader>
      <div className="rounded-md border bg-card">
        {isPlaceholderData && (
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded-full animate-pulse">
              Updating...
            </span>
          </div>
        )}
        <Table
          className={
            isPlaceholderData
              ? 'opacity-50 transition-opacity'
              : 'transition-opacity'
          }
        >
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <CustomerSummary
                key={customer.id}
                customer={customer}
                onDelete={onDeleteCustomer}
                onUpdate={onUpdateCustomer}
              />
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-lg font-medium text-tertiary">
                      No customers found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
