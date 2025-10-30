import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface ColloHeaderProps {
  title: string;
  subtitle?: string;
  showExplore?: boolean;
  onExplore?: () => void;
}

export function ColloHeader({ title, subtitle, showExplore, onExplore }: ColloHeaderProps) {
  return (
    <div className="bg-gradient-primary rounded-[20px] p-6 md:p-8 text-center shadow-glow mb-8">
      {subtitle && (
        <div className="opacity-90 mb-2 text-sm font-medium">{subtitle}</div>
      )}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>
      {showExplore && (
        <Button
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 hover:-translate-y-0.5 transition-all"
          onClick={onExplore}
        >
          <Search className="mr-2 h-4 w-4" />
          Explore Services
        </Button>
      )}
    </div>
  );
}