interface TicketMessageProps {
  message: string;
  isSentByMeOrPeer: boolean;
  id: number;
  created_at: string;
  name: string | undefined;
}

export default function TicketMessage({
  message,
  isSentByMeOrPeer,
  id,
  created_at,
  name,
}: TicketMessageProps) {
  return (
    <div
      key={id}
      className={`flex flex-col max-w-[80%] gap-2 p-2.5 ${isSentByMeOrPeer ? 'self-end items-end' : 'self-start items-start'}`}
    >
      <div
        className={`px-4 py-2 rounded-2xl text-sm ${
          isSentByMeOrPeer
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none'
        }`}
      >
        <div
          className={`text-sm font-medium mb-1 ${
            isSentByMeOrPeer
              ? 'text-primary-foreground/70'
              : 'text-muted-foreground'
          }`}
        >
          {name}
        </div>
        <div className="leading-normal whitespace-pre-wrap">{message}</div>
        <div
          className={`text-xs pt-1 mt-2 ${
            isSentByMeOrPeer ? 'text-primary-foreground/70' : 'text-tertiary'
          }`}
        >
          {new Date(created_at).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
