import { useQuery } from "@tanstack/react-query";
import { getUserStats, getCurrentUser } from "@/services/api";
import { FiCalendar, FiHeart, FiUsers, FiClock, FiActivity, FiMessageCircle, FiZap } from "react-icons/fi";
import { SheCard } from "@/ui/Card";
import { getProgressPercent } from "@/utils/helpers";
import { Link } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  calendar: FiCalendar,
  heart: FiHeart,
  users: FiUsers,
  clock: FiClock,
};

const colorMap: Record<string, string> = {
  calendar: "bg-shecare-blue-light text-shecare-blue",
  heart: "bg-shecare-pink-light text-primary",
  users: "bg-shecare-green-light text-shecare-green",
  clock: "bg-shecare-orange-light text-shecare-orange",
};

export function StatsGrid() {
  const { data: stats, isLoading, isError } = useQuery({ queryKey: ["stats"], queryFn: getUserStats });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <SheCard key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-20 mb-3" />
            <div className="h-8 bg-muted rounded w-16 mb-2" />
            <div className="h-3 bg-muted rounded w-24" />
          </SheCard>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <SheCard className="col-span-full text-center py-12">
        <p className="text-destructive">Could not load your dashboard stats.</p>
      </SheCard>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((stat) => {
        const Icon = iconMap[stat.icon] || FiActivity;
        const color = colorMap[stat.icon] || "bg-muted text-muted-foreground";
        return (
          <SheCard key={stat.label}>
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            {stat.change && <p className="text-xs text-shecare-green mt-1">{stat.change}</p>}
          </SheCard>
        );
      })}
    </div>
  );
}

export function WelcomeHeader() {
  const { data: user } = useQuery({ queryKey: ["user"], queryFn: getCurrentUser });

  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        Welcome back, {user?.name || "..."} 🌸
      </h1>
      <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
    </div>
  );
}

export function TreatmentProgress() {
  const { data: user } = useQuery({ queryKey: ["user"], queryFn: getCurrentUser });
  const percent = user ? getProgressPercent(user.treatmentDay, user.totalTreatmentDays) : 0;

  return (
    <SheCard>
      <h3 className="text-sm font-semibold text-foreground mb-3">Treatment Progress</h3>
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>Day {user?.treatmentDay || 0} of {user?.totalTreatmentDays || 0}</span>
        <span className="font-semibold text-primary">{percent}%</span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full shecare-gradient rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </SheCard>
  );
}

export function QuickActions() {
  const actions = [
    { label: "Log Symptoms", icon: FiActivity, to: "/health", color: "bg-shecare-pink-light text-primary" },
    { label: "Book Appointment", icon: FiCalendar, to: "/consultation", color: "bg-shecare-blue-light text-shecare-blue" },
    { label: "Community", icon: FiMessageCircle, to: "/community", color: "bg-shecare-green-light text-shecare-green" },
    { label: "AI Assistant", icon: FiZap, to: "/ai", color: "bg-shecare-purple-light text-shecare-purple" },
  ];

  return (
    <SheCard>
      <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <Link key={a.label} to={a.to}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center`}>
                <a.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-foreground">{a.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </SheCard>
  );
}
