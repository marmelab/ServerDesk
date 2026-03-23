import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { HousePlus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Button } from './ui/button';

export default function AddCompanyDialog() {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState('');
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

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

  return (
    <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
      <DialogTrigger asChild>
        <Button className="group-hover:bg-primary group-hover:text-primary-foreground w-fit">
          <HousePlus className="ms-2 size-4" />
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
  );
}
