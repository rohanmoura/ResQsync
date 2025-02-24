"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { TextEffect } from "../core/text-effect";
import { TextLoop } from "../core/text-loop";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const router = useRouter();

  // Dialog open states
  const [getHelpDialogOpen, setGetHelpDialogOpen] = useState(false);
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);

  // Form states for Get Help
  const [helpType, setHelpType] = useState("");
  const [helpDescription, setHelpDescription] = useState("");

  // Form state for Volunteer
  const [volunteerReason, setVolunteerReason] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsAuthenticated(!!token);
    if (token) {
      // Simulated profile completion check (set localStorage "profileComplete" to "true" if filled)
      const profileComplete = localStorage.getItem("profileComplete");
      setIsProfileComplete(profileComplete === "true");
    }
  }, []);

  const handleGetHelpButtonClick = () => {
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "To get help, please sign up first.",
        action: {
          label: "Sign Up",
          onClick: () => router.push("/signup"),
        },
      });
      return;
    }
    if (!isProfileComplete) {
      toast.error("Please complete your profile details before requesting help.");
      return;
    }
    setGetHelpDialogOpen(true);
  };

  const handleVolunteerButtonClick = () => {
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "To volunteer, please sign up first.",
        action: {
          label: "Sign Up",
          onClick: () => router.push("/signup"),
        },
      });
      return;
    }
    if (!isProfileComplete) {
      toast.error("Please complete your profile details before volunteering.");
      return;
    }
    setVolunteerDialogOpen(true);
  };

  const handleGetHelpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!helpType.trim()) {
      toast.error("Please fill the type of help.");
      return;
    }
    if (!helpDescription.trim()) {
      toast.error("Please fill the description of help.");
      return;
    }
    try {
      await axios.post("http://localhost:8081/api/help-requests/submit", {
        helpType,
        helpDescription,
      });
      toast.success("Help request submitted successfully!");
      setGetHelpDialogOpen(false);
      setHelpType("");
      setHelpDescription("");
    } catch (error) {
      toast.error("Failed to submit help request. Please try again.");
    }
  };

  const handleVolunteerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!volunteerReason.trim()) {
      toast.error("Please fill the reason for volunteering.");
      return;
    }
    try {
      await axios.post("http://localhost:8081/api/volunteers/add", {
        volunteerReason,
      });
      toast.success("Volunteer application submitted successfully!");
      setVolunteerDialogOpen(false);
      setVolunteerReason("");
    } catch (error) {
      toast.error("Failed to submit volunteer application. Please try again.");
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
          <Button
            size="sm"
            className="w-fit bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 px-6 py-3 font-medium transition-all rounded-lg shadow-lg animate-pulse"
            onClick={handleGetHelpButtonClick}
          >
            Get Help
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-fit bg-white text-black border-2 border-black dark:bg-black dark:text-white dark:border-white hover:bg-gray-200 hover:text-black dark:hover:bg-white dark:hover:text-black transition-all rounded-lg shadow-lg px-6 py-3 animate-bounce"
            onClick={handleVolunteerButtonClick}
          >
            Volunteer
          </Button>
        </div>
      </div>

      {/* Get Help Dialog */}
      <Dialog open={getHelpDialogOpen} onOpenChange={setGetHelpDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Request Assistance</DialogTitle>
          <form onSubmit={handleGetHelpSubmit} className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              value={helpType}
              onChange={(e) => setHelpType(e.target.value)}
              placeholder="Type of Help"
              className="border p-2 rounded"
            />
            <textarea
              value={helpDescription}
              onChange={(e) => setHelpDescription(e.target.value)}
              placeholder="Description of Help"
              className="border p-2 rounded"
            ></textarea>
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Volunteer Dialog */}
      <Dialog open={volunteerDialogOpen} onOpenChange={setVolunteerDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Volunteer Application</DialogTitle>
          <form onSubmit={handleVolunteerSubmit} className="flex flex-col gap-4 mt-4">
            <textarea
              value={volunteerReason}
              onChange={(e) => setVolunteerReason(e.target.value)}
              placeholder="Reason for Volunteering"
              className="border p-2 rounded"
            ></textarea>
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
