import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Company } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await supabase.from('companies').select('*');
  if (error) throw error;
  return data;
}

export default function CompaniesPage() {
  const {
    data: companies = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Companies</h1>

      {isPending && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-destructive">{error.message}</p>}

      {!isPending && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.id}</TableCell>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>
                  {new Date(company.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {companies.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No companies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
