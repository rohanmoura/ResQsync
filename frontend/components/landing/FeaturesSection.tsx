"use client";
import { motion } from 'framer-motion'; // Import motion from framer-motion
import { Spotlight } from '@/components/core/spotlight'; // Import Spotlight
import { BarChart, Ambulance, Bell, MapPin } from 'lucide-react';
import { InView } from '../core/in-view';
import { TextRoll } from '../core/text-roll';
import { Tilt } from '../core/tilt';
import { Spotlighter } from '../core/spotlighter';

const features = [
  {
    icon: MapPin,
    title: "Live Crisis & Healthcare Tracking",
    description: "Monitor emergencies and hospital resources in real-time.",
  },
  {
    icon: Ambulance,
    title: "Emergency Dispatch",
    description: "Coordinate ambulances and urgent medical help.",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Notify responders and hospitals instantly.",
  },
  {
    icon: BarChart,
    title: "Smart Insights",
    description: "Use AI-driven data for better decision-making.",
  },
];



export default function FeaturesSection() {
  return (
    <section id="solutions" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Use InView to trigger TextRoll on scroll */}
        <InView
          viewOptions={{ once: true, margin: '0px 0px -100px 0px' }} // Trigger when 100px from the bottom
        >
          {({ inView }: { inView: boolean }) => (
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[hsl(var(--foreground))]">
              {inView ? (
                <TextRoll
                  className="inline-block"
                  duration={0.5} // Adjust the animation speed
                >
                  Key Features
                </TextRoll>
              ) : (
                <span className="opacity-0">Key Features</span> // Hidden until in view
              )}
            </h2>
          )}
        </InView>
        {/* Wrap the grid with InView */}
        <InView
          viewOptions={{ once: true, margin: '0px 0px -250px 0px' }} // Trigger animation when 250px from the bottom
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.09, // Stagger effect for each card
              },
            },
          }}
        >
          {({ inView }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 md:gap-8 justify-items-center">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Tilt
                    key={index}
                    rotationFactor={8} // Adjust the tilt intensity
                    isRevese={true} // Reverse the tilt direction if needed
                    className="relative aspect-video h-[200px] overflow-hidden rounded-xl bg-zinc-300/30 p-[1px] dark:bg-zinc-700/30 w-full max-w-[300px]"
                  >
                    {/* Spotlight Border */}
                    <Spotlighter
                      className="from-indigo-500 via-indigo-500 to-transparent blur-lg opacity-100"
                      size={124}
                    />
                    {/* Card Content */}
                    <div className="relative h-full w-full rounded-xl bg-white dark:bg-black">
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
                          visible: {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            transition: { duration: 1.2, type: 'spring', bounce: 0.3 },
                          },
                        }}
                        className="h-full w-full p-6 flex flex-col items-center shadow-md transition transform hover:scale-105"
                      >
                        <Icon className="w-12 h-12 mb-4 text-indigo-500" />
                        <h3 className="text-xl font-semibold mb-2 text-center text-[hsl(var(--card-foreground))]">
                          {feature.title}
                        </h3>
                        <p className="text-center text-[hsl(var(--muted-foreground))]">
                          {feature.description}
                        </p>
                      </motion.div>
                    </div>
                  </Tilt>
                );
              })}
            </div>
          )}
        </InView>
      </div>
    </section>
  );
}