import { AppUser, Customer } from '@/types';
import { Crown } from 'lucide-react';

interface CompanyContactsViewProps {
  customerManagers: AppUser[];
  customers: Customer[];
}

export default function CompanyContactsView({
  customerManagers,
  customers,
}: CompanyContactsViewProps) {
  return (
    <div className="font-normal pl-8">
      <div className={customerManagers.length > 0 ? 'mb-2' : undefined}>
        {customerManagers.map((customerManager) => (
          <div
            key={customerManager.id}
            title="Customer Manager"
            className="flex items-center gap-3"
          >
            <span>{customerManager.name}</span>
            <Crown size={15} aria-label="Customer Manager" />
          </div>
        ))}
      </div>
      {customers.map((customer) => (
        <div key={customer.id} className="flex gap-3">
          <span>{customer.name}</span>
        </div>
      ))}
      {customers.length === 0 && customerManagers.length === 0 && (
        <span className="text-tertiary">No customers yet.</span>
      )}
    </div>
  );
}
