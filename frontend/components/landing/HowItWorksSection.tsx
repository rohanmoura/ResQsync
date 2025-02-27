"use client";
import { InView } from '@/components/core/in-view'; // Import InView
import { TextRoll } from '@/components/core/text-roll'; // Import TextRoll
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion'; // Import motion from framer-motion

const steps = [
  {
    number: "01",
    title: "Connect",
    description: "Link ResQSync with emergency systems.",
  },
  {
    number: "02",
    title: "Monitor",
    description: "Track resources and emergencies live.",
  },
  {
    number: "03",
    title: "Respond",
    description: "Use AI insights for quick action.",
  },
];


export default function HowItWorksSection() {
  return (
    <section id="process" className="py-20">
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
                  How It Works
                </TextRoll>
              ) : (
                <span className="opacity-0">How It Works</span> // Hidden until in view
              )}
            </h2>
          )}
        </InView>
        {/* Cards Grid */}
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
            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.09, // Stagger effect for each card
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 md:gap-8 justify-items-center"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' }, // Initial state
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)', // Final state
                      transition: {
                        duration: 1.2,
                        type: 'spring',
                        bounce: 0.3,
                      },
                    },
                  }}
                >
                  <Card
                    className="flex flex-col items-center p-6 rounded-lg shadow-md transition-transform hover:scale-105 w-full max-w-[300px]"
                  >
                    <CardHeader className="mb-4">
                      <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {step.number}
                      </div>
                    </CardHeader>
                    <CardTitle className="text-xl font-semibold mb-2 text-center">
                      {step.title}
                    </CardTitle>
                    <CardContent>
                      <p className="text-gray-600 text-center">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </InView>
      </div>
    </section>
  );
}