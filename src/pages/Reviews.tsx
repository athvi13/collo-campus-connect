import { ColloSidebar } from "@/components/ColloSidebar";
import { ColloHeader } from "@/components/ColloHeader";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Reviews() {
  return (
    <div className="flex min-h-screen">
      <ColloSidebar />
      <main className="flex-1 p-6 md:p-10">
        <ColloHeader title="Reviews & Ratings" subtitle="⭐ Share Your Experience" />
        <Card className="bg-card/50 backdrop-blur-collo p-8 text-center border border-border">
          <Star className="w-16 h-16 mx-auto mb-4 text-collo-yellow" />
          <h3 className="text-xl font-bold mb-2">Reviews Coming Soon</h3>
          <p className="text-muted-foreground">Rate and review services to help other students</p>
        </Card>
      </main>
    </div>
  );
}