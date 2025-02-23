"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/core/spotlight";
import { TextEffect } from "../core/text-effect";
import { TextLoop } from "../core/text-loop";
import GetHelpToast from "./GetHelpToast";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GetHelpForm } from "../forms/GetHelpForm";

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleGetHelpClick = () => {
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "To get help, please sign up first.",
        action: {
          label: "Sign Up",
          onClick: () => router.push("/signup"),
        },
      });
    }
  };

  const handleVolunteerClick = () => {
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "To volunteer, please sign up first.",
        action: {
          label: "Sign Up",
          onClick: () => router.push("/signup"),
        },
      });
    }
  };

  return (
    <section id="about" className="w-full min-h-screen flex items-center justify-center relative">
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
          Seamlessly allocate resources, track crises in real time, and dispatch help at the push of a button.
        </TextEffect>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
          {isAuthenticated ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="w-fit bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 px-6 py-3 font-medium transition-all rounded-lg shadow-lg animate-pulse"
                >
                  Get Help
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogTitle>Request Assistance</DialogTitle>
                <GetHelpForm />
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              size="sm"
              className="w-fit bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 px-6 py-3 font-medium transition-all rounded-lg shadow-lg animate-pulse"
              onClick={handleGetHelpClick}
            >
              Get Help
            </Button>
          )}
          {isAuthenticated ? (
            <Dialog>
              <DialogTrigger asChild>
                {/* Volunteer Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-fit bg-white text-black border-2 border-black dark:bg-black dark:text-white dark:border-white hover:bg-gray-200 hover:text-black dark:hover:bg-white dark:hover:text-black transition-all rounded-lg shadow-lg px-6 py-3 animate-bounce"
                >
                  Volunteer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogTitle>Request Assistance</DialogTitle>
                <GetHelpForm />
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-fit bg-white text-black border-2 border-black dark:bg-black dark:text-white dark:border-white hover:bg-gray-200 hover:text-black dark:hover:bg-white dark:hover:text-black transition-all rounded-lg shadow-lg px-6 py-3 animate-bounce"
              onClick={handleVolunteerClick}
            >
              Volunteer
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
