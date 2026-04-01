import { Company } from '@/types';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';

interface CompanySummaryProps {
  company: Company;
  onAssign: (company: Company) => void;
  isAdmin: boolean;
}

export default function CcompanySummary({
  company,
  onAssign,
  isAdmin,
}: CompanySummaryProps) {
  return (
    <TableRow key={company.id}>
      <TableCell className="font-medium">
        <div className="flex flex-col font-semibold">
          <span>{company.name}</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{new Date(company.created_at).toLocaleDateString()}</span>
        </div>
      </TableCell>
      <TableCell>
        {isAdmin && (
          <Button
            className="group-hover:bg-primary group-hover:text-primary-foreground w-full cursor-pointer"
            onClick={() => onAssign(company)}
          >
            Invite Manager
            <svg
              className="ms-2 size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
