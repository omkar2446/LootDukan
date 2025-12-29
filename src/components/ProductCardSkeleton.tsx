import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-card">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
