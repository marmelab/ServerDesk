import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { InviteDialog } from './InviteDialog';

export default function CompanyCard({ company }: { company: Company }) {
  const { user } = useAuth();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteCompanyId, setInviteCompanyId] = useState<number | null>(null);

  const handleOpenInvite = async (companyId: number) => {
    setInviteCompanyId(companyId);
    setIsInviteOpen(true);
  };

  return (
    <Card
      key={company.id}
      className="group relative flex flex-col gap-2 overflow-hidden pt-0"
    >
      <CardHeader className="flex-1 pt-4">
        <CardTitle className="text-2xl font-semibold text-balance">
          {company.name}
        </CardTitle>
      </CardHeader>

      <CardFooter className="flex-col items-start space-y-4 pt-4">
        <div className="flex w-full items-baseline justify-between">
          <div>
            <span className="text-foreground text-sm font-bold">
              {new Date(company.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        {user?.role === 'admin' && (
          <Button
            className="group-hover:bg-primary group-hover:text-primary-foreground w-full cursor-pointer"
            onClick={() => handleOpenInvite(company.id)}
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
      </CardFooter>
      <InviteDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        initialCompanyId={inviteCompanyId}
        appRole={'customer_manager'}
      />
    </Card>
  );
}
