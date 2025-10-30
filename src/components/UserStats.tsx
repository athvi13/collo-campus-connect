import { TrendingUp, Star, Flame } from "lucide-react";

interface UserStatsProps {
  userName?: string;
  points?: number;
  reviews?: number;
  streak?: number;
}

export function UserStats({ 
  userName = "Student", 
  points = 0, 
  reviews = 0, 
  streak = 0 
}: UserStatsProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="text-sm font-medium">{userName}</div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-collo-orange flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
          <span>{points}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-collo-green flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
          <span>{reviews}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-collo-red flex items-center justify-center">
            <Flame className="w-3 h-3 text-white" />
          </div>
          <span>{streak}</span>
        </div>
      </div>
    </div>
  );
}