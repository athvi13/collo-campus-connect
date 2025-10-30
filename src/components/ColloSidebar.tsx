import { NavLink } from "react-router-dom";
import { 
  LayoutGrid, 
  Star, 
  Map, 
  GraduationCap, 
  Car, 
  Dog, 
  Plus, 
  User 
} from "lucide-react";

const navItems = [
  { title: "Services", url: "/", icon: LayoutGrid, color: "bg-collo-orange" },
  { title: "Reviews", url: "/reviews", icon: Star, color: "bg-collo-green" },
  { title: "College Map", url: "/map", icon: Map, color: "bg-collo-blue" },
  { title: "Tutoring", url: "/tutoring", icon: GraduationCap, color: "bg-collo-purple" },
  { title: "Transport", url: "/transport", icon: Car, color: "bg-collo-red" },
  { title: "Pets", url: "/pets", icon: Dog, color: "bg-[#f97316]" },
  { title: "Add Service", url: "/add-service", icon: Plus, color: "bg-collo-green" },
  { title: "Profile", url: "/profile", icon: User, color: "bg-collo-gray" },
];

export function ColloSidebar() {
  return (
    <div className="w-[280px] bg-card/80 backdrop-blur-collo p-5 flex flex-col gap-2 border-r border-border">
      <div className="text-[32px] font-bold bg-gradient-primary bg-clip-text text-transparent mb-8 tracking-tight">
        COLLO
      </div>

      {navItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          end
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-primary text-white shadow-glow"
                : "hover:bg-primary/20 hover:translate-x-1"
            }`
          }
        >
          <div
            className={`w-7 h-7 rounded-md ${item.color} flex items-center justify-center mr-3`}
          >
            <item.icon className="w-4 h-4 text-white" />
          </div>
          <span>{item.title}</span>
        </NavLink>
      ))}
    </div>
  );
}