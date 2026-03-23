import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FilePlus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TicketInsert, TicketPriority, Priorities } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

export default function AddTicketDialog() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<TicketPriority>('medium');

  const resetTicket = () => {
    setSubject('');
    setDescription('');
    setPriority('medium');
    setIsOpen(false);
  };

  const { mutate: addTicket, isPending: isAdding } = useMutation({
    mutationFn: async (newTicket: TicketInsert) => {
      const { error } = await supabase.from('tickets').insert(newTicket);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      resetTicket();
      toast.success('Ticket created successfully!');
    },
  });

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.company_ids?.length) {
      toast.error('You are not linked to any company.');
      return;
    }
    addTicket({
      subject,
      description,
      priority,
      company_id: user?.company_ids[0],
      customer_id: user?.id,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="group-hover:bg-primary group-hover:text-primary-foreground w-fit">
          <FilePlus className="ms-2 size-4" />
          Add Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleAddTicket}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Add a new ticket
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground pt-1">
            Fill the informations of the ticket.
          </DialogDescription>
          <div className="space-y-4">
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as TicketPriority)}
              >
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue placeholder="Choose priority" />
                </SelectTrigger>
                <SelectContent>
                  {Priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${p.color}`} />
                        {p.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              className="cursor-pointer my-5"
              type="submit"
              disabled={isAdding}
            >
              {isAdding ? 'Creating...' : 'Add Ticket'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
