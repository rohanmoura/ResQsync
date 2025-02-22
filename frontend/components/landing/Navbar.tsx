"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ToogleMode";
import { AnimatedBackground } from '@/components/core/animated-background';
import { GlowEffect } from "@/components/core/glow-effect";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const TABS = [
        { label: "About Us", href: "#about" },
        { label: "Solutions", href: "#solutions" },
        { label: "Process", href: "#process" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Hospital Data", href: "/hospital-data" },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // ✅ Function to check JWT token validity every 10 seconds
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem("jwtToken");
            const exp = localStorage.getItem("jwtExp");

            if (token && exp) {
                const now = Math.floor(Date.now() / 1000); // Current timestamp

                if (now > parseInt(exp)) {
                    console.log("Token expired! Logging out...");
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("jwtExp");
                    setIsAuthenticated(false);
                    router.push("/signin");
                } else {
                    setIsAuthenticated(true);
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        // ✅ Check every 10 seconds
        const interval = setInterval(checkAuthStatus, 10000);
        checkAuthStatus(); // Initial check

        return () => clearInterval(interval);
    }, [router]);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[hsl(var(--card))] shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="text-xl font-bold text-primary">
                    ResQSync
                </Link>

                {/* Center: Navigation Menu */}
                <div className="hidden md:flex space-x-8 relative">
                    <AnimatedBackground
                        defaultValue={TABS[0].label}
                        className="rounded-lg bg-zinc-100 dark:bg-zinc-800"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                        enableHover
                    >
                        {TABS.map((tab, index) => (
                            <Link
                                key={index}
                                href={tab.href}
                                data-id={tab.label}
                                className="px-4 py-1.5 text-base font-medium text-foreground transition-colors duration-300 hover:text-primary dark:text-zinc-400 dark:hover:text-zinc-50"
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </AnimatedBackground>
                </div>

                {/* Right: Mode Toggle & Auth Buttons */}
                <div className="flex items-center space-x-7">
                    <ModeToggle />
                    <div className="relative inline-block">
                        <GlowEffect
                            colors={['#6366F1', '#818CF8', '#A78BFA', '#C7D2FE']}
                            mode="colorShift"
                            blur="medium"
                            duration={2}
                            scale={1.1}
                        />
                        {isAuthenticated ? (
                            <Link href="/profile" passHref>
                                <Button
                                    variant="ghost"
                                    className="relative inline-flex items-center gap-1 rounded-md px-4 py-2 font-semibold 
                                    bg-transparent text-zinc-950 border border-zinc-300 dark:border-zinc-700 
                                    dark:text-zinc-50 hover:bg-indigo-500 hover:text-white hover:border-transparent 
                                    dark:hover:bg-indigo-600 dark:hover:text-white dark:hover:border-transparent"
                                >
                                    Profile
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/signin" passHref>
                                <Button
                                    variant="ghost"
                                    className="relative inline-flex items-center gap-1 rounded-md px-4 py-2 font-semibold 
                                    bg-transparent text-zinc-950 border border-zinc-300 dark:border-zinc-700 
                                    dark:text-zinc-50 hover:bg-indigo-500 hover:text-white hover:border-transparent 
                                    dark:hover:bg-indigo-600 dark:hover:text-white dark:hover:border-transparent"
                                >
                                    Log In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Hamburger Menu for Mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-primary focus:outline-none"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[hsl(var(--card))] shadow-md mt-2 py-4 z-40">
                    {TABS.map((tab, index) => (
                        <Link
                            key={index}
                            href={tab.href}
                            className="block px-4 py-2 text-base font-medium text-foreground hover:text-primary dark:text-zinc-400 dark:hover:text-zinc-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
