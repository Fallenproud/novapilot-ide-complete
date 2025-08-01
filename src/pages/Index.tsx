
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Architecture from "@/components/sections/Architecture";
import DevelopmentEnvironment from "@/components/demo/DevelopmentEnvironment";
import Capabilities from "@/components/sections/Capabilities";
import Onboarding from "@/components/sections/Onboarding";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Architecture />
      <DevelopmentEnvironment />
      <Capabilities />
      <Onboarding />
      <Footer />
    </div>
  );
};

export default Index;
