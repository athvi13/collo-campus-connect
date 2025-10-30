import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ColloSidebar } from "@/components/ColloSidebar";
import { ColloHeader } from "@/components/ColloHeader";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building2, Navigation } from "lucide-react";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

interface Location {
  id: string;
  name: string;
  building: string;
  floor: number;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
}

const typeColors: Record<string, string> = {
  classroom: "bg-collo-blue",
  lab: "bg-collo-purple",
  office: "bg-collo-gray",
  hostel: "bg-collo-orange",
  canteen: "bg-collo-green",
  library: "bg-[#8b5cf6]",
  auditorium: "bg-collo-red",
  sports: "bg-[#10b981]",
  parking: "bg-[#6b7280]",
  department: "bg-collo-blue",
  other: "bg-muted",
};

export default function CollegeMap() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        fetchLocations();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from("campus_map")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to load locations");
      return;
    }

    setLocations(data || []);
    setFilteredLocations(data || []);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredLocations(locations);
      return;
    }

    const filtered = locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.building?.toLowerCase().includes(query.toLowerCase()) ||
        loc.type.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredLocations(filtered);
  };

  if (!session) return null;

  return (
    <div className="flex min-h-screen">
      <ColloSidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <ColloHeader
          title="College Campus Map"
          subtitle="🗺️ Navigate Your Campus"
        />

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for rooms, buildings, facilities..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white/5 border-input h-12"
            />
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-collo p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Campus Locations</h3>
              <Badge variant="secondary">
                {filteredLocations.length} locations
              </Badge>
            </div>

            {filteredLocations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No locations found</p>
                <p className="text-sm mt-2">
                  {searchQuery
                    ? "Try a different search term"
                    : "Start by adding locations to your campus map"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLocations.map((location) => (
                  <Card
                    key={location.id}
                    className="bg-background/50 p-4 border border-border hover:border-primary/50 transition-all cursor-pointer hover:-translate-y-1"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-card-foreground mb-1">
                          {location.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Building2 className="w-3 h-3" />
                          <span>
                            {location.building}
                            {location.floor && `, Floor ${location.floor}`}
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          typeColors[location.type]
                        } text-white text-xs`}
                      >
                        {location.type}
                      </Badge>
                    </div>

                    {location.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {location.description}
                      </p>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success("Directions feature coming soon!");
                      }}
                    >
                      <Navigation className="w-3 h-3 mr-2" />
                      Get Directions
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}