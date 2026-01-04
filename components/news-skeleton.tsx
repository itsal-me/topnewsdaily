import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function NewsCardSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col shadow-sm mb-8">
            <Skeleton className="w-full h-56" />

            <CardHeader className="grow">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>

                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4 mb-3" />

                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>

            <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-28" />
                </div>
            </CardContent>
        </Card>
    );
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <Skeleton className="h-12 w-80 mb-10" />
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="break-inside-avoid">
                        <NewsCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}
