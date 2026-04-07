import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/tw.utils";
import type { FeedPost } from "@/types/namuType";

const FeedCard = ({ post }: { post: FeedPost }) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback
                className={cn(
                  "text-sm font-semibold text-white",
                  post.avatarColor
                )}
              >
                {post.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {post.author}
              </div>
              <div className="text-xs text-muted-foreground">
                {post.crop} · {post.timeAgo}
              </div>
            </div>
          </div>
          <Badge variant={post.badge.variant}>{post.badge.label}</Badge>
        </div>

        <p className="mb-4 text-sm text-foreground">{post.content}</p>

        <div className="mb-3 grid grid-cols-4 gap-2">
          {post.sensors.map((sensor) => (
            <div
              key={sensor.label}
              className="rounded-md border bg-muted/50 px-3 py-2"
            >
              <div className="text-xs text-muted-foreground">{sensor.label}</div>
              <div className="text-sm font-bold text-foreground">
                {sensor.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-3 flex gap-1">
          {Array.from({ length: post.barCount }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-sm",
                i < post.activeBarCount ? "bg-success" : "bg-success/25"
              )}
            />
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t pt-3">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-danger">
            <Heart className="size-4" />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
            <MessageCircle className="size-4" />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
            <Share2 className="size-4" />
            <span>공유</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedCard;
