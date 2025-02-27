"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TextShimmer } from "../core/text-shimmer";
import { InfiniteSlider } from "../core/infinite-slider";

const testimonials = [
  {
    quote: "ResQSync has transformed our emergency response.",
    author: "John Doe",
    title: "Emergency Response Director",
  },
  {
    quote: "Real-time tracking has improved our response times.",
    author: "Jane Smith",
    title: "Fire Chief",
  },
  {
    quote: "Faster disaster response and better coordination.",
    author: "Mark Anderson",
    title: "Paramedic Supervisor",
  },
  {
    quote: "User-friendly and streamlined our operations.",
    author: "Sarah Thompson",
    title: "911 Dispatch Coordinator",
  },
];


export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-20 bg-transparent">
      {/* Keep content above the spotlight with a higher z-index */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shimmer Animation for Heading */}
        <h2 className="mb-12 text-center text-3xl font-bold">
          <TextShimmer
            duration={1.5} // Increased duration for smoother animation
            spread={3} // Wider gradient spread for a shinier effect
            className={`
              text-3xl font-bold 
              [--base-color:theme(colors.gray.800)] 
              [--base-gradient-color:theme(colors.indigo.500)] 
              dark:[--base-color:theme(colors.gray.100)] 
              dark:[--base-gradient-color:theme(colors.indigo.400)]
            `}
          >
            What Our Users Say
          </TextShimmer>
        </h2>
        {/* Infinite Slider for Testimonials */}
        <InfiniteSlider durationOnHover={75} gap={24}>
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 shadow-lg rounded-lg w-[300px] sm:w-[350px] md:w-[400px] flex-shrink-0"
            >
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  “{testimonial.quote}”
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">
                  {testimonial.author}
                </span>
                <span className="text-sm text-muted-foreground">
                  {testimonial.title}
                </span>
              </CardFooter>
            </Card>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}