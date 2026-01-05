import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewsItem } from "@/lib/rss";
import { formatTimeAgo } from "@/lib/time";
import { ExternalLink } from "lucide-react";

interface NewsCardProps {
    item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-0 shadow-sm mb-8">
            {item.thumbnail && (
                <div className="relative w-full h-56 bg-muted overflow-hidden">
                    <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={90}
                        priority={false}
                    />
                </div>
            )}

            <CardHeader className="space-y-3 pb-4">
                <div className="flex items-center justify-between gap-3">
                    <Badge
                        variant="secondary"
                        className="capitalize text-xs font-medium"
                    >
                        {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(item.pubDate)}
                    </span>
                </div>

                <CardTitle className="line-clamp-3 text-xl font-serif font-bold leading-tight tracking-tight">
                    {item.title}
                </CardTitle>

                <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                    {item.contentSnippet || "No description available"}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 pb-5">
                <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.source}
                    </span>

                    <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="text-xs font-medium"
                    >
                        <Link
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read More
                            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
