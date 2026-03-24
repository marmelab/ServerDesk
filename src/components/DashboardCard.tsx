import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';

export function DashboardCard({ title, to }: { title: string; to: string }) {
  return (
    <Card className="group relative flex flex-col gap-2 overflow-hidden pt-0">
      <CardHeader className="flex-1 pt-4">
        <CardTitle className="text-2xl font-semibold text-balance">
          {title}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start space-y-4 pt-4">
        <Link
          to={to}
          className={buttonVariants({
            variant: 'default',
            size: 'sm',
            className: 'w-full group',
          })}
        >
          View List
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
