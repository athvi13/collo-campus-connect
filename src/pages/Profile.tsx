import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ColloSidebar } from "@/components/ColloSidebar";
import { ColloHeader } from "@/components/ColloHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen">
      <ColloSidebar />
      <main className="flex-1 p-6 md:p-10">
        <ColloHeader title="My Profile" subtitle="👤 Manage Your Account" />
        <Card className="bg-card/50 backdrop-blur-collo p-8 border border-border max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold">
              {profile?.full_name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{profile?.full_name || "Student"}</h2>
              <p className="text-muted-foreground">Active Member</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-background/50 p-4 text-center border border-border">
              <div className="text-3xl font-bold text-collo-orange mb-1">{profile?.points || 0}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </Card>
            <Card className="bg-background/50 p-4 text-center border border-border">
              <div className="text-3xl font-bold text-collo-green mb-1">{profile?.reviews_count || 0}</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </Card>
            <Card className="bg-background/50 p-4 text-center border border-border">
              <div className="text-3xl font-bold text-collo-red mb-1">{profile?.streak_days || 0}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </Card>
          </div>

          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </Card>
      </main>
    </div>
  );
}