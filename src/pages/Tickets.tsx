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
import { TicketInsert, TicketPriority, Priorities, Statuses } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchTickets, PAGE_SIZE } from '@/services/Tickets';

export default function TicketsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [page, setPage] = useState<number>(0);

  const {
    data,
    isPending,
    isPlaceholderData,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['tickets', page],
    queryFn: () => fetchTickets(page),
    placeholderData: (previousData) => previousData,
  });

  const tickets = data?.data ?? [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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
    <div className="container mx-auto py-10">
      {isPending && <p className="text-muted-foreground">Loading...</p>}

      {queryError && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold italic">
            Failed to load tickets
          </h3>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {!isPending && !queryError && (
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
            {user?.role === 'customer_manager' && (
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
                        <Label
                          htmlFor="description"
                          className="text-right mt-2"
                        >
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
            )}
          </header>

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
                  <TableHead className="w-[400px]">Subject</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  {(user?.role === 'admin' || user?.role === 'agent') && (
                    <TableHead>Company</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => {
                  const priorityInfo = Priorities.find(
                    (p) => p.value === ticket.priority,
                  );
                  const statusInfo = Statuses.find(
                    (p) => p.value === ticket.status,
                  );
                  return (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{ticket.subject}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${priorityInfo?.color}`}
                          />
                          <span className="capitalize text-sm">
                            {ticket.priority}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${statusInfo?.color}`}
                          />
                          <span className="capitalize text-sm">
                            {ticket.status}
                          </span>
                        </div>
                      </TableCell>
                      {(user?.role === 'admin' || user?.role === 'agent') && (
                        <TableCell>{ticket.company?.name}</TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {tickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-lg font-medium">No tickets found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page{' '}
                <span className="font-bold text-foreground">{page + 1}</span> on{' '}
                <span className="font-bold text-foreground">
                  {totalPages || 1}
                </span>
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                ({totalCount} tickets)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                disabled={page === 0 || isPlaceholderData}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (tickets.length === PAGE_SIZE) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={tickets.length < PAGE_SIZE || isPlaceholderData}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
