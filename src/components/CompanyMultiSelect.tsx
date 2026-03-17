import { Check, ChevronsUpDown } from 'lucide-react';
import { cn, fetchCompanies } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Props {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function CompanyMultiSelect({ selectedIds, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const {
    data: companies = [],
    isPending,
    error: queryError,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  const toggleCompany = (id: number) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    onChange(newSelection);
  };

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="flex flex-col gap-3">
      {!isPending && !queryError && (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedIds.length > 0
                  ? `${selectedIds.length} companies selected`
                  : 'Select companies...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search company..." />
                <CommandList>
                  <CommandEmpty>No company found.</CommandEmpty>
                  <CommandGroup>
                    {companies.map((company) => (
                      <CommandItem
                        key={company.id}
                        onSelect={() => toggleCompany(company.id)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedIds.includes(company.id)
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {company.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex flex-wrap gap-2">
            {selectedIds.map((id) => {
              const name = companies.find((c) => c.id === id)?.name;
              return (
                <Badge key={id} variant="secondary">
                  {name}
                </Badge>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
