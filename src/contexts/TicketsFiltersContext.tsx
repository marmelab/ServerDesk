import { UseTicketFilters } from '@/hooks/useTickets';
import { TicketPriority, TicketStatus } from '@/types';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

type TicketsFiltersContextType = {
  searchLabel: string;
  setSearchLabel: (val: string) => void;
  selectedPriority: TicketPriority | undefined;
  setSelectedPriority: (val: TicketPriority | undefined) => void;
  selectedStatus: TicketStatus | undefined;
  setSelectedStatus: (val: TicketStatus | undefined) => void;
  selectedCompanies: number[];
  setSelectedCompanies: (val: number[]) => void;
  page: number;
  setPage: (val: number) => void;
  clearFilters: () => void;
  filters: UseTicketFilters;
};

const TicketsFiltersContext = createContext<
  TicketsFiltersContextType | undefined
>(undefined);

export function TicketsFiltersProvider({ children }: { children: ReactNode }) {
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [searchLabel, setSearchLabel] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<
    TicketPriority | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<
    TicketStatus | undefined
  >();
  const [page, setPage] = useState<number>(0);
  const [debounceSearchLabel] = useDebounce(searchLabel, 500);

  const filters = useMemo(
    (): UseTicketFilters => ({
      searchLabel: debounceSearchLabel,
      status: selectedStatus,
      priority: selectedPriority,
      companies: selectedCompanies,
    }),
    [debounceSearchLabel, selectedStatus, selectedPriority, selectedCompanies],
  );

  const clearFilters = () => {
    setSearchLabel('');
    setSelectedCompanies([]);
    setSelectedPriority(undefined);
    setSelectedStatus(undefined);
    setPage(0);
  };

  const value = {
    searchLabel,
    setSearchLabel,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    selectedCompanies,
    setSelectedCompanies,
    page,
    setPage,
    filters,
    clearFilters,
  };

  return (
    <TicketsFiltersContext.Provider value={value}>
      {children}
    </TicketsFiltersContext.Provider>
  );
}

export const useTicketsFiltersContext = () => {
  const context = useContext(TicketsFiltersContext);
  if (context === undefined) {
    throw new Error(
      'useGetTicketsListContext must be used within a GetTicketsListContextProvider',
    );
  }
  return context;
};
