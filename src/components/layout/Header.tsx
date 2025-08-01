
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              NovaPilot
            </span>
            <Badge variant="secondary" className="ml-2 text-xs">
              AI Co-Pilot
            </Badge>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="#demo"
            >
              Demo
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="#architecture"
            >
              Architecture
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="#capabilities"
            >
              Capabilities
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="#onboarding"
            >
              Guide
            </a>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Try Demo
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
