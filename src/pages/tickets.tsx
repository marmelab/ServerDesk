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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ticket, TicketInsert, TicketPriority, Priorities } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { handleSupabaseError } from '@/lib/error_handler';
import { toast } from 'sonner';

async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase.from('tickets').select('*');
  if (error) handleSupabaseError(error);
  return data || [];
}

export default function TicketsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<TicketPriority>('medium');

  const {
    data: tickets = [],
    isPending,
    error: queryError,
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTickets,
  });

  const resetTicket = () => {
    setSubject('');
    setDescription('');
    setIsOpen(false);
  };

  const { mutate: addTicket, isPending: isAdding } = useMutation({
    mutationFn: async (newTicket: TicketInsert) => {
      const { error } = await supabase.from('tickets').insert(newTicket);
      if (error) handleSupabaseError(error);
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
    <div className="container mx-auto py-10">
      {isPending && <p className="text-muted-foreground">Loading...</p>}

      {!isPending && !queryError && (
        <div className="mx-auto max-w-7xl">
          <header className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Tickets
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="group relative flex flex-col gap-2 overflow-hidden pt-0"
              >
                <CardHeader className="flex-1 pt-4">
                  <CardTitle className="text-2xl font-semibold text-balance">
                    {ticket.subject}
                  </CardTitle>
                </CardHeader>

                <CardFooter className="flex-col items-start space-y-4 pt-4">
                  <div className="flex w-full items-baseline justify-between">
                    <div>
                      <span className="text-foreground text-xl font-bold">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
            {tickets.length === 0 && <h2>No tickets found.</h2>}
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer my-10" variant="outline">
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
                      onValueChange={(val) =>
                        setPriority(val as TicketPriority)
                      }
                    >
                      <SelectTrigger id="priority" className="w-full">
                        <SelectValue placeholder="Choose priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {Priorities.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${p.color}`}
                              />
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
        </div>
      )}
    </div>
  );
}
