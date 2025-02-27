"use client";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/core/glow-effect"; // Import GlowEffect
import { ArrowRight } from "lucide-react"; // Import ArrowRight icon
import { InView } from "../core/in-view";
import { TextEffect } from "../core/text-effect";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* TextEffect Animations with InView */}
        <InView viewOptions={{ margin: "0px 0px -200px 0px" }}>
          {({ inView }) => (
            <div className="flex flex-col space-y-4">
              <TextEffect
                per="char"
                delay={0.5}
                variants={{
                  container: {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 },
                    },
                  },
                  item: {
                    hidden: { opacity: 0, rotateX: 90, y: 10 },
                    visible: {
                      opacity: 1,
                      rotateX: 0,
                      y: 0,
                      transition: { duration: 0.2 },
                    },
                  },
                }}
                className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))]"
              >
                Ready to Enhance Emergency Response?
              </TextEffect>
              <TextEffect
                per="char"
                delay={1.5}
                className="text-base sm:text-lg text-[hsl(var(--muted-foreground))]"
              >
                Join ResQSync and transform crisis management.
              </TextEffect>
            </div>
          )}
        </InView>
        {/* Glow Effect Button with Link */}
        <div className="relative inline-block mt-8">
          <GlowEffect
            colors={['#6366F1', '#818CF8', '#A78BFA', '#C7D2FE']} // Indigo-based glow colors
            mode="colorShift" // Smooth color transition
            blur="strong" // Stronger glow effect
            duration={3} // Duration of the animation
            scale={1.2} // Larger glow size
          />
          <Link href="/signup" passHref>
            <Button
              size="lg"
              className={`
              relative inline-flex items-center gap-1 rounded-md px-6 py-2 font-semibold 
              bg-zinc-950 text-zinc-50 outline outline-1 outline-[#fff2f21f] 
              dark:bg-white dark:text-zinc-950 
              hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white
              transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl
            `}
            >
              Sign Up Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}