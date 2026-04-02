import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PAGE_SIZE } from '@/services/Tickets';
import AddTicketDialog from '@/components/tickets/AddTicketDialog';
import { PageHeader } from '@/components/PageHeader';
import TicketSummary from '@/components/tickets/TicketSummary';
import {
  PRIORITY_MAP,
  STATUS_MAP,
  TicketPriority,
  TicketStatus,
  TicketWithDetails,
} from '@/types';
import { Drawer } from '@/components/ui/drawer';
import TicketDetails from '../components/tickets/TicketDetail';
import { TicketFilters, useTickets } from '@/hooks/useTickets';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Pagination } from '@/components/Pagination';
import { Placeholder } from '@/components/Placeholder';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ErrorView from '@/components/ErrorView';
import PendingView from '@/components/PendingView';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { CompanyMultiSelect } from '@/components/companies/CompanyMultiSelect';
import { useDebounce } from 'use-debounce';

export default function TicketsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const [selectedTicket, setSelectedTicket] =
    useState<TicketWithDetails | null>(null);

  const [searchLabel, setSearchLabel] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<
    TicketPriority | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [debounceSearchLabel] = useDebounce(searchLabel, 500);

  const filters = useMemo(
    (): TicketFilters => ({
      searchLabel: debounceSearchLabel,
      status: selectedStatus,
      priority: selectedPriority,
      companies: selectedCompanies,
    }),
    [debounceSearchLabel, selectedStatus, selectedPriority, selectedCompanies],
  );

  const {
    data: tickets,
    count,
    isPending,
    isPlaceholderData,
    error,
    refetch,
  } = useTickets({ filters, page });
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  const toggleValue = <T,>(
    id: T,
    selected: T[],
    setSelected: (value: T[]) => void,
  ) => {
    const newSelection = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];
    setSelected(newSelection);
  };

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="container mx-auto py-10">
      {error && <ErrorView label="Failed to load tickets" refetch={refetch} />}
      {isPending && <PendingView label="Loading tickets" />}
      {!isPending && !error && (
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Tickets"
            description="View and manage all tickets."
          >
            {user?.role === 'customer_manager' && <AddTicketDialog />}
          </PageHeader>

          <div className="flex py-2">
            <InputGroup className="max-w-xs">
              <InputGroupInput
                placeholder="Search..."
                value={searchLabel}
                onChange={(e) => setSearchLabel(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                {count} results
              </InputGroupAddon>
            </InputGroup>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Companies</Button>
              </PopoverTrigger>
              <PopoverContent>
                <CompanyMultiSelect
                  selectedIds={selectedCompanies}
                  onChange={setSelectedCompanies}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Status</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandList className="h-[200px] overflow-y-auto border-t">
                    <CommandGroup>
                      {Object.values(STATUS_MAP).map((status) => (
                        <CommandItem
                          key={status.value}
                          onSelect={() =>
                            toggleValue(
                              status.value,
                              selectedStatus,
                              setSelectedStatus,
                            )
                          }
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedStatus.includes(status.value)
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          <Badge
                            variant="secondary"
                            className="whitespace-nowrap"
                            data-testid="ticket-status"
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${status.color}`}
                            />
                            {status.label}
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Select
              value={selectedPriority ?? ''}
              onValueChange={(value) =>
                setSelectedPriority(value as TicketPriority)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(PRIORITY_MAP).map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="whitespace-nowrap"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${priority.color}`}
                          />
                          {priority.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border bg-card">
            {isPlaceholderData && <Placeholder />}

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
                {tickets.map((ticket) => (
                  <TicketSummary
                    key={ticket.id}
                    ticket={ticket}
                    onSelect={setSelectedTicket}
                  />
                ))}
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
            <Drawer
              open={!!selectedTicket}
              onOpenChange={(open) => !open && setSelectedTicket(null)}
              direction="right"
            >
              {selectedTicket && <TicketDetails ticket={selectedTicket} />}
            </Drawer>
          </div>
          <Pagination
            totalPages={totalPages}
            totalCount={count ?? 0}
            currentCount={tickets.length}
            page={page}
            isPlaceholderData={isPlaceholderData}
            pageSize={PAGE_SIZE}
            setPage={setPage}
            label="tickets"
          />
        </div>
      )}
    </div>
  );
}
