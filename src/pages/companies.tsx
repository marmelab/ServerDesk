import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import type { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await supabase.from('companies').select('*');
  if (error) throw error;
  return data;
}

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const {
    data: companies = [],
    isPending,
    error: queryError,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  const [company, setCompany] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  const handleAddCompany = async () => {
    try {
      const { error } = await supabase
        .from('companies')
        .insert({ name: company });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setCompany('');
      setIsOpen(false);
    } catch (err: any) {
      const message = err?.message || err?.error_description || 'Error unknown';
      setError('Error while adding entry');
      console.error(message);
      setIsOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      {isPending && <p className="text-muted-foreground">Loading...</p>}
      {queryError && <p className="text-destructive">{queryError.message}</p>}

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
                  <CardTitle className="text-xl font-semibold text-balance">
                    {company.name}
                  </CardTitle>
                </CardHeader>

                <CardFooter className="flex-col items-start space-y-4 pt-4">
                  <div className="flex w-full items-baseline justify-between">
                    <div>
                      <span className="text-foreground text-2xl font-bold">
                        {new Date(company.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button className="group-hover:bg-primary group-hover:text-primary-foreground w-full cursor-pointer">
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
                </CardFooter>
              </Card>
            ))}
            {companies.length === 0 && <h2>No companies found.</h2>}
          </div>

          {error && <p className="text-destructive">{error}</p>}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer my-10" variant="outline">
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddCompany();
                }}
              >
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
                    disabled={isPending}
                  >
                    Add
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
