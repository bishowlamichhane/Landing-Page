"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Demo", href: "#demo" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                OS
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">
                Open Shop
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400"
                asChild
              >
                <Link to="/login">Log In</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] border-l border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex flex-col h-full">
                  <div className="py-6">
                    <Link
                      to="/"
                      className="flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                        OS
                      </div>
                      <span className="font-bold text-xl">Open Shop</span>
                    </Link>
                  </div>

                  <nav className="flex flex-col gap-6 py-8">
                    {navItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="text-lg font-medium hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>

                  <div className="mt-auto py-8 flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white"
                      asChild
                    >
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
