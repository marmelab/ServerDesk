import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import React from 'react';

interface DashboardCardProps {
  icon: React.ReactNode;
  count: number | undefined;
  label: string;
  title: string;
  to: string;
}

export function DashboardCard({
  icon,
  count,
  label,
  title,
  to,
}: DashboardCardProps) {
  return (
    <Link to={to} className="block group">
      <Card className="relative overflow-hidden transition-all duration-200 hover:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </CardTitle>
          <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            {icon}
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold tracking-tight">
              {count ?? 0}
            </span>
            <p className="text-xs text-tertiary italic">{label}</p>
          </div>
        </CardContent>

        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
      </Card>
    </Link>
  );
}
