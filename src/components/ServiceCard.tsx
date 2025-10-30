import { Card } from "./ui/card";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  rating?: number;
  location?: string;
  onClick?: () => void;
}

export function ServiceCard({
  title,
  description,
  icon,
  iconColor,
  rating,
  location,
  onClick,
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "bg-card/50 backdrop-blur-collo p-6 border border-border",
        "hover:-translate-y-1 hover:shadow-glow hover:border-primary/50",
        "transition-all duration-300 cursor-pointer"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4",
          iconColor
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-card-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {description}
      </p>
      {(rating || location) && (
        <div className="flex items-center gap-4 text-sm">
          {rating && (
            <div className="flex items-center gap-1 text-collo-yellow">
              <Star className="w-4 h-4 fill-current" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}