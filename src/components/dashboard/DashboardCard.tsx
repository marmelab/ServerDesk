import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface DashboardCardProps {
  icon: React.ReactNode;
  count: number | undefined;
  label: string;
  title: string;
}

export function DashboardCard({ icon, count, label }: DashboardCardProps) {
  return (
    <div className="block group">
      <Card className="relative overflow-hidden transition-all duration-200 hover:border-primary/50">
        <CardContent>
          <div className="flex w-full max-w-sm overflow-hidden h-24">
            <div className="flex items-center justify-center w-1/3 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <div className="[&_svg]:size-18">{icon}</div>
            </div>
            <div className="flex flex-col items-center justify-center w-2/3 p-4">
              <span className="text-7xl font-bold tracking-tight">
                {count ?? 0}
              </span>
              <span className="text-xs text-tertiary italic">{label}</span>
            </div>
          </div>
        </CardContent>

        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
      </Card>
    </div>
  );
}
