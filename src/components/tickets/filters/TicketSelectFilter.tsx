import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterOption {
  value: string;
  label: string;
  color: string;
}

interface TicketSelectFilterProps<T extends string> {
  selected: T | '';
  setSelected: (value: T) => void;
  map: Record<T, FilterOption>;
  label: string;
}

export default function TicketSelectFilter<T extends string>({
  selected,
  setSelected,
  map,
  label,
}: TicketSelectFilterProps<T>) {
  return (
    <Select value={selected} onValueChange={(value) => setSelected(value as T)}>
      <SelectTrigger className="w-[180px] data-[placeholder]:text-primary">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          {(Object.values(map) as FilterOption[]).map((element) => (
            <SelectItem key={element.value} value={element.value}>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="whitespace-nowrap">
                  <span className={`h-2 w-2 rounded-full ${element.color}`} />
                  {element.label}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
