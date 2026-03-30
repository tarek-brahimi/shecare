import HeroSection, { FeaturesSection } from "@/features/landing/HeroSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <HeroSection />
        <FeaturesSection />
      </div>
    </div>
  );
}
