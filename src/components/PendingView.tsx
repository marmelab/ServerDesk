interface PendingViewProps {
  label: string;
}

export default function PendingView({ label }: PendingViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h3 className="text-xl font-semibold italic">{label}</h3>
    </div>
  );
}
