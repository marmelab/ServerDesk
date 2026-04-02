import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRIORITY_MAP, TicketPriority } from '@/types';

interface TicketPriorityFilterProps {
  selectedPriority?: TicketPriority;
  setSelectedPriority: (value: TicketPriority) => void;
}

export default function TicketPriorityFilter({
  selectedPriority,
  setSelectedPriority,
}: TicketPriorityFilterProps) {
  return (
    <Select
      value={selectedPriority ?? ''}
      onValueChange={(value) => setSelectedPriority(value as TicketPriority)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.values(PRIORITY_MAP).map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="whitespace-nowrap">
                  <span className={`h-2 w-2 rounded-full ${priority.color}`} />
                  {priority.label}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
