"use client";
import React from "react";
import Navbar from "@/components/landing/Navbar";
const HeroSection = dynamic(() => import("@/components/landing/HeroSection"), {
  ssr: false, // disable SSR for HeroSection
});
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
// 1) Import your global Spotlight component
import { Spotlight } from "@/components/core/spotlight";
import dynamic from "next/dynamic";
import DataSection from "@/components/landing/DataSection";

export default function Home() {
  return (
    // 2) Give the page a single background (Tailwind: bg-background text-foreground)
    <main className="relative min-h-screen bg-background text-foreground">
      {/* 3) Global Spotlight behind everything (fixed + pointer-events-none) */}
      <Spotlight
        className="
          pointer-events-none 
          fixed inset-0 
          z-0 
          blur-sm 
          opacity-70 
          bg-[radial-gradient(circle_at_60%_40%,#6366F1,transparent_80%)]
          dark:mix-blend-lighten mix-blend-multiply
        "
        size={300}
        springOptions={{ bounce: 0.1, duration: 0.5 }}
      />
      {/* 4) Main content container with higher z-index to appear above the spotlight */}
      <div className="relative z-10">
        {/* Responsive Navbar */}
        <Navbar />

        {/* Responsive Hero Section */}
        <HeroSection />

        {/* Responsive Features Section */}
        <FeaturesSection />

        {/* New Data Section */}
        <DataSection />

        {/* Responsive How It Works Section */}
        <HowItWorksSection />

        {/* Responsive Testimonials Section */}
        <TestimonialsSection />

        {/* Responsive Call-to-Action Section */}
        <CTASection />

        {/* Responsive Footer */}
        <Footer />
      </div>
    </main>
  );
}