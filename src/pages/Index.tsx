
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Architecture from "@/components/sections/Architecture";
import DevelopmentEnvironment from "@/components/demo/DevelopmentEnvironment";
import Capabilities from "@/components/sections/Capabilities";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Architecture />
      <DevelopmentEnvironment />
      <Capabilities />
    </div>
  );
};

export default Index;
