import { Button } from './ui/button';

interface PageHelperProps {
  totalPages: number;
  totalCount: number;
  currentCount: number;
  page: number;
  isPlaceholderData: boolean;
  pageSize: number;
  setPage: any;
  label: string;
}

export function PageHelper({
  totalPages,
  totalCount,
  currentCount,
  page,
  isPlaceholderData,
  pageSize,
  setPage,
  label,
}: PageHelperProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-tertiary">
          Page <span className="font-bold text-tertiary">{page + 1}</span> on{' '}
          <span className="font-bold text-tertiary">{totalPages || 1}</span>
        </span>
        <span className="text-xs text-tertiary ml-2">
          ({totalCount} {label})
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((old: any) => Math.max(old - 1, 0))}
          disabled={page === 0 || isPlaceholderData}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (currentCount === pageSize) {
              setPage((old: any) => old + 1);
            }
          }}
          disabled={currentCount < pageSize || isPlaceholderData}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
