import { AppUserRole } from '@/types';

interface TicketMessageProps {
  message: string;
  role: AppUserRole | null | undefined;
  id: number;
  created_at: string;
  name: string | undefined;
}

export default function TicketMessage({
  message,
  role,
  id,
  created_at,
  name,
}: TicketMessageProps) {
  const isInternal = role === 'agent';

  return (
    <div
      key={id}
      className={`flex flex-col max-w-[80%] gap-2 p-4 ${isInternal ? 'self-end items-end' : 'self-start items-start'}`}
    >
      <div
        className={`px-4 py-2 rounded-2xl text-sm ${
          isInternal
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none'
        }`}
      >
        <div
          className={`text-sm font-medium mb-1 ${
            isInternal ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {name}
        </div>
        <div className="leading-normal">{message}</div>
        <div
          className={`text-xs pt-1 mt-2 ${
            isInternal ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {new Date(created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
