"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/core/spotlight";
import { TextEffect } from "../core/text-effect";
import { TextLoop } from "../core/text-loop";
import { Magnetic } from "../core/magnetic";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/core/dialog";
import { GetHelpForm } from "../forms/GetHelpForm";

export default function HeroSection() {
  const springOptions = { bounce: 0.1 };

  return (
    <section
      id="about"
      className="w-full min-h-screen flex items-center justify-center relative"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center space-y-6 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight dark:text-white text-black flex flex-col sm:flex-row justify-center items-center">
          <TextEffect as="span" per="word" preset="blur" className="inline-block">
            ResQSync
          </TextEffect>
          <TextLoop className="ml-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight dark:text-white text-black hidden md:inline-block overflow-hidden">
            <span>: Optimize Crisis Response</span>
            <span>: Streamline Emergency Management</span>
            <span>: Revolutionize Disaster Relief</span>
            <span>: Simplify Resource Allocation</span>
          </TextLoop>
        </h1>
        <TextEffect
          as="p"
          per="word"
          preset="fade-in-blur"
          className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto dark:text-gray-300 text-gray-700"
        >
          Seamlessly allocate resources, track crises in real time, and dispatch
          help at the push of a button.
        </TextEffect>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
          {/* Get Help Button with Dialog integration */}
          <Dialog>
            <DialogTrigger>
              <div className="cursor-pointer inline-block">
                <Button asChild>
                  <span>
                    <Magnetic
                      intensity={0.2}
                      springOptions={springOptions}
                      actionArea="global"
                      range={200}
                    >
                      <Magnetic
                        intensity={0.1}
                        springOptions={springOptions}
                        actionArea="global"
                        range={200}
                      >
                        Get Help
                      </Magnetic>
                    </Magnetic>
                  </span>
                </Button>
              </div>
            </DialogTrigger>
            {/* Add centering classes to DialogContent */}
            <DialogContent className="fixed inset-0 flex items-center justify-center">
              <div className="w-full max-w-md p-6 shadow-[0_4px_12px_#0000001a] backdrop:bg-white/80 backdrop:backdrop-blur-xs bg-white dark:bg-black">
                <DialogHeader>
                  <DialogTitle className="text-black dark:text-white">
                    Get Help
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Fill out the form below to request help.
                  </DialogDescription>
                </DialogHeader>
                <GetHelpForm />
                <DialogClose />
              </div>
            </DialogContent>
          </Dialog>

          {/* Volunteer Button */}
          <Magnetic
            intensity={0.2}
            springOptions={springOptions}
            actionArea="global"
            range={200}
          >
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-black border-2 border-black dark:bg-black dark:text-white dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all transform hover:scale-105 font-medium px-6 py-3 sm:px-8 sm:py-4"
            >
              <Magnetic
                intensity={0.1}
                springOptions={springOptions}
                actionArea="global"
                range={200}
              >
                Volunteer
              </Magnetic>
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
