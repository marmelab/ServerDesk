import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { STATUS_MAP, TicketStatus } from '@/types';
import { Check } from 'lucide-react';

interface TicketStatusFilterProps {
  selectedStatus: TicketStatus[];
  setSelectedStatus: (value: TicketStatus[]) => void;
}

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

export default function TicketStatusFilter({
  selectedStatus,
  setSelectedStatus,
}: TicketStatusFilterProps) {
  return (
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
                    toggleValue(status.value, selectedStatus, setSelectedStatus)
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
                    <span className={`h-2 w-2 rounded-full ${status.color}`} />
                    {status.label}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
