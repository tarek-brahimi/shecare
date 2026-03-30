import { Link } from "react-router-dom";
import { FiArrowRight, FiHeart, FiUsers, FiShield } from "react-icons/fi";
import { SheButton } from "@/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 shecare-gradient opacity-5 rounded-3xl" />
      <div className="relative px-6 py-16 md:py-24 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <FiHeart className="w-4 h-4" /> Supporting Your Journey
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
          You're Not Alone in This{" "}
          <span className="text-primary">Fight</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          SheCare empowers women with breast cancer through medical support, mental health care, and a caring community.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to={isAuthenticated ? "/dashboard" : "/login"}>
            <SheButton size="lg">
              {isAuthenticated ? "Go to Dashboard" : "Sign In"} <FiArrowRight className="w-4 h-4" />
            </SheButton>
          </Link>
          <Link to={isAuthenticated ? "/community" : "/register"}>
            <SheButton variant="outline" size="lg">
              {isAuthenticated ? "Join Community" : "Create Account"}
            </SheButton>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    { icon: FiHeart, title: "Health Tracking", desc: "Monitor symptoms, wellness scores, and treatment progress.", color: "bg-shecare-pink-light text-primary" },
    { icon: FiUsers, title: "Community", desc: "Connect with women who understand your journey.", color: "bg-shecare-blue-light text-shecare-blue" },
    { icon: FiShield, title: "Expert Resources", desc: "Access guides, videos, and support materials.", color: "bg-shecare-green-light text-shecare-green" },
  ];

  return (
    <section className="py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
        Everything You Need, In One Place
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="shecare-card p-6 text-center">
            <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-4`}>
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
