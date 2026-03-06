import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import type { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    error,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  const [company, setCompany] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('companies')
        .insert({ name: company });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setCompany('');
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Companies</h1>

      {isPending && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-destructive">{error.message}</p>}

      {!isPending && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.id}</TableCell>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>
                  {new Date(company.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {companies.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No companies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Company</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a new company</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Enter the name of the company you want to add.
          </DialogDescription>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Company
              </Label>
              <Input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" onClick={handleAddCompany}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
