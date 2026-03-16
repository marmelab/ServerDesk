import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import type { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useInviteManager } from '@/hooks/use_create_token';
import { InviteManagerDialog } from '@/components/invite-manager-dialog';
import { useAuth } from '@/contexts/AuthContext';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

import { toast } from 'sonner';

async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, created_at');
  if (error) {
    throw error;
  }
  return data || [];
}

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [company, setCompany] = useState('');
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { createInvite, isGenerating, inviteToken, resetInvite } =
    useInviteManager();

  const {
    data: companies = [],
    isPending,
    error: queryError,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  const { mutate: addCompany, isPending: isAdding } = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from('companies').insert({ name });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setCompany('');
      setIsAddCompanyOpen(false);
      toast.success('Company added successfully!');
    },
  });

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    addCompany(company);
  };

  const handleOpenInvite = async (company: Company) => {
    setIsInviteOpen(true);
    resetInvite();
    await createInvite({
      company_id: [company.id],
      app_role: 'customer_manager',
    });
  };

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="container mx-auto py-10">
      {!isPending && !queryError && (
        <div className="mx-auto max-w-7xl">
          <header className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Companies
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
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
                  {user?.role == 'admin' && (
                    <Button
                      className="group-hover:bg-primary group-hover:text-primary-foreground w-full cursor-pointer"
                      onClick={() => handleOpenInvite(company)}
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
              </Card>
            ))}
            {companies.length === 0 && <h2>No companies found.</h2>}
          </div>

          <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer my-10" variant="outline">
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleAddCompany}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold tracking-tight">
                    Add a new company
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-muted-foreground pt-1">
                  Enter the name of the company you want to add.
                </DialogDescription>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Company
                    </Label>
                    <Input
                      type="text"
                      id="link"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <Button
                    className="cursor-pointer my-5"
                    type="submit"
                    disabled={isAdding}
                  >
                    Add
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <InviteManagerDialog
            open={isInviteOpen}
            onOpenChange={setIsInviteOpen}
            inviteToken={inviteToken}
            isGenerating={isGenerating}
          />
        </div>
      )}
    </div>
  );
}
