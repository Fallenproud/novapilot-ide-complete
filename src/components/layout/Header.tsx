import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2, Sparkles, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", href: "/", icon: Code2 },
    { name: "Playground", href: "/playground", icon: Play },
    { name: "Architecture", href: "/#architecture" },
    { name: "Demo", href: "/#demo" },
    { name: "Capabilities", href: "/#capabilities" },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div 
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-4 w-4 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            NovaPilot
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href.startsWith('/#') && location.pathname === '/' && location.hash === item.href.slice(1));
            
            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                asChild
                className="transition-all duration-200 hover:scale-105"
              >
                {item.href.startsWith('/#') ? (
                  <a href={item.href}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.name}
                  </a>
                ) : (
                  <Link to={item.href}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.name}
                  </Link>
                )}
              </Button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-2">
          <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
            <Link to="/playground">
              <Play className="mr-2 h-4 w-4" />
              Try Playground
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background/95 backdrop-blur"
          >
            <div className="container py-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.href.startsWith('/#') ? (
                      <a href={item.href}>
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.name}
                      </a>
                    ) : (
                      <Link to={item.href}>
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.name}
                      </Link>
                    )}
                  </Button>
                ))}
                <Button className="w-full mt-4 bg-gradient-to-r from-primary to-purple-600" asChild>
                  <Link to="/playground" onClick={() => setIsMenuOpen(false)}>
                    <Play className="mr-2 h-4 w-4" />
                    Try Playground
                  </Link>
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
