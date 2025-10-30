import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ColloSidebar } from "@/components/ColloSidebar";
import { ColloHeader } from "@/components/ColloHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { UserStats } from "@/components/UserStats";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, TrendingUp } from "lucide-react";
import { Session } from "@supabase/supabase-js";

const services = [
  {
    title: "Student Hostels",
    description: "Find verified hostels near your campus with great amenities",
    icon: "🏠",
    iconColor: "bg-collo-orange",
    rating: 4.5,
  },
  {
    title: "Mess Services",
    description: "Delicious and affordable meal plans for students",
    icon: "🍽️",
    iconColor: "bg-collo-green",
    rating: 4.8,
  },
  {
    title: "Private Tutors",
    description: "Expert tutors for all subjects and competitive exams",
    icon: "📚",
    iconColor: "bg-collo-purple",
    rating: 4.7,
  },
  {
    title: "Transport",
    description: "Safe and reliable transport options for daily commute",
    icon: "🚗",
    iconColor: "bg-collo-blue",
    rating: 4.6,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    setProfile(data);
  };

  if (!session) return null;

  return (
    <div className="flex min-h-screen">
      <ColloSidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <ColloHeader
          title="Discover Student Services"
          subtitle="🎓 Welcome to Your Student Hub"
          showExplore
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="bg-gradient-primary hover:opacity-90">
            🏠 Browse Hostels
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            🍽️ Find Mess
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            📚 Get Tutor
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            🚗 Book Ride
          </Button>
        </div>
      </main>

      <aside className="w-[320px] p-5 md:p-8 flex flex-col gap-5 hidden lg:flex">
        <UserStats
          userName={profile?.full_name || "Student"}
          points={profile?.points || 0}
          reviews={profile?.reviews_count || 0}
          streak={profile?.streak_days || 0}
        />

        <Card className="bg-card/50 backdrop-blur-collo p-5 border border-border">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-collo-green flex items-center justify-center text-sm">
                ✓
              </div>
              <div className="flex-1 text-sm">
                <div className="font-medium">Service Approved</div>
                <div className="text-muted-foreground text-xs">Your hostel listing is live</div>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-collo-blue flex items-center justify-center text-sm">
                ⭐
              </div>
              <div className="flex-1 text-sm">
                <div className="font-medium">New Review</div>
                <div className="text-muted-foreground text-xs">You got a 5-star rating!</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card/50 backdrop-blur-collo p-5 border border-border">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trending
          </h3>
          <div className="space-y-3">
            {["Sunrise Hostel", "College Mess", "IIT Tutor"].map((name, i) => (
              <div
                key={name}
                className="flex justify-between items-center pb-3 border-b border-border last:border-0"
              >
                <div className="text-sm font-medium">{name}</div>
                <div className="flex items-center gap-1 text-collo-yellow text-sm">
                  <span>⭐</span>
                  <span>{(4.5 + i * 0.1).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}