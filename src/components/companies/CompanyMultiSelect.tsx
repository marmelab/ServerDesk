import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchCompanies } from '@/services/Companies';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface Props {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}
export function CompanyMultiSelect({ selectedIds, onChange }: Props) {
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
    return (
      <p className="text-muted-foreground p-10 text-center">Loading ...</p>
    );

  return (
    <div className="flex flex-col gap-3">
      {!isPending && !queryError && (
        <>
          <div className="flex flex-wrap gap-2 h-24 overflow-y-auto border rounded-md p-2 items-start">
            {selectedIds.length > 0 ? (
              selectedIds.map((id) => {
                const name = companies.find((c) => c.id === id)?.name;
                return (
                  <Badge key={id} variant="secondary">
                    {name}
                  </Badge>
                );
              })
            ) : (
              <span className="text-sm text-muted-foreground italic">
                No companies assigned
              </span>
            )}
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Command>
              <CommandInput placeholder="Search company..." />
              <CommandList className="h-[200px] overflow-y-auto border-t">
                <CommandEmpty>No company found.</CommandEmpty>
                <CommandGroup>
                  {companies.map((company) => (
                    <CommandItem
                      key={company.id}
                      onSelect={() => toggleCompany(company.id)}
                      data-testid="assign-company"
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
          </div>
        </>
      )}
    </div>
  );
}
