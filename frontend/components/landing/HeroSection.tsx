"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { TextEffect } from "../core/text-effect";
import { TextLoop } from "../core/text-loop";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"; // Using shadcn dialog
import { Loader2 } from "lucide-react";

// Define type for user profile (added roles)
interface UserProfile {
  name: string;
  phone?: string;
  area?: string;
  bio?: string;
  roles?: string[];
}

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Dialog open states
  const [getHelpDialogOpen, setGetHelpDialogOpen] = useState(false);
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);

  // Form states for Get Help
  const [helpType, setHelpType] = useState("");
  const [helpDescription, setHelpDescription] = useState("");

  // Form states for Volunteer
  const [volunteerReason, setVolunteerReason] = useState("");
  // New volunteer dialog states:
  const volunteerTypeOptions = [
    "MEDICAL_ASSISTANCE",
    "PATIENT_SUPPORT",
    "ADMINISTRATIVE_SUPPORT",
    "COMMUNITY_HEALTH",
    "EMERGENCY_RESPONSE",
    "COUNSELING_SUPPORT",
    "TECHNICAL_IT_SUPPORT",
  ];
  const [volunteerTypes, setVolunteerTypes] = useState<string[]>([]);
  const [volunteerSkillInput, setVolunteerSkillInput] = useState("");
  const [volunteerSkills, setVolunteerSkills] = useState<string[]>([]);
  const [isVolunteerSubmitting, setIsVolunteerSubmitting] = useState(false);

  // New state: tracks if user already is a volunteer
  const [isVolunteer, setIsVolunteer] = useState(false);

  // Helper to check which required fields are missing (ignoring helpRequests)
  const getMissingFields = (profile: UserProfile) => {
    const missing: string[] = [];
    if (!profile.name) missing.push("name");
    if (!profile.phone) missing.push("phone");
    if (!profile.area) missing.push("area");
    if (!profile.bio) missing.push("bio");
    return missing;
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsAuthenticated(true);
      axios
        .get("http://localhost:8081/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data;
          setUserProfile(data);
          const missing = getMissingFields(data);
          setIsProfileComplete(missing.length === 0);
          // If roles include "Volunterr", mark user as volunteer.
          if (data.roles && data.roles.includes("Volunterr")) {
            setIsVolunteer(true);
          } else {
            setIsVolunteer(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          // Optionally, handle error (e.g., force logout or show a message)
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
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
    if (!userProfile) {
      toast.error("Loading profile. Please wait...");
      return;
    }
    const missing = getMissingFields(userProfile);
    if (missing.length > 0) {
      toast.error(
        `Please fill your ${missing.join(", ")} details before requesting help.`
      );
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
    if (!userProfile) {
      toast.error("Loading profile. Please wait...");
      return;
    }
    const missing = getMissingFields(userProfile);
    if (missing.length > 0) {
      toast.error(
        `Please fill your ${missing.join(", ")} details before volunteering.`
      );
      return;
    }
    setVolunteerDialogOpen(true);
  };

  // New: Delete Volunteer Handler
  const handleDeleteVolunteer = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast("Authentication Required", {
        description: "Please sign in first.",
      });
      return;
    }
    try {
      await axios.delete("http://localhost:8081/api/volunteers/deletevolunteerrole", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Volunteer role removed successfully!");
      setIsVolunteer(false);
    } catch (error) {
      toast.error("Failed to remove volunteer role. Please try again.");
    }
  };

  const handleGetHelpSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8081/api/help-requests/submit",
        { helpType, helpDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Help request submitted successfully!");
      setGetHelpDialogOpen(false);
      setHelpType("");
      setHelpDescription("");
    } catch (error) {
      toast.error("Failed to submit help request. Please try again.");
    }
  };

  const handleVolunteerSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    // Validate volunteer types
    if (volunteerTypes.length === 0) {
      toast.error("Please select at least one type of volunteer support.");
      return;
    }
    // Validate skills
    if (volunteerSkills.length === 0) {
      toast.error("Please add at least one skill.");
      return;
    }
    // Validate reason (to be sent as 'about')
    if (!volunteerReason.trim()) {
      toast.error("Please fill the reason for volunteering.");
      return;
    }
    setIsVolunteerSubmitting(true);
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8081/api/volunteers/add",
        {
          volunteeringTypes: volunteerTypes,
          skills: volunteerSkills,
          about: volunteerReason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Volunteer application submitted successfully!");
      // Reset volunteer form states and mark user as volunteer
      setVolunteerDialogOpen(false);
      setVolunteerTypes([]);
      setVolunteerSkills([]);
      setVolunteerSkillInput("");
      setVolunteerReason("");
      setIsVolunteer(true);
    } catch (error) {
      toast.error("Failed to submit volunteer application. Please try again.");
    } finally {
      setIsVolunteerSubmitting(false);
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const skill = volunteerSkillInput.trim();
      if (!skill) return;
      if (volunteerSkills.includes(skill)) {
        toast.error("Skill already added.");
        return;
      }
      if (volunteerSkills.length >= 5) {
        toast.error("You can add a maximum of 5 skills.");
        return;
      }
      setVolunteerSkills([...volunteerSkills, skill]);
      setVolunteerSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setVolunteerSkills(volunteerSkills.filter((s) => s !== skill));
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );

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
            // Use same styling; if user is volunteer, increase horizontal padding slightly
            className={`w-fit ${isVolunteer ? "px-8" : "px-6"
              } py-3 text-black border-2 border-black dark:bg-black dark:text-white dark:border-white hover:bg-gray-200 hover:text-black dark:hover:bg-white dark:hover:text-black transition-all rounded-lg shadow-lg animate-bounce`}
            onClick={isVolunteer ? handleDeleteVolunteer : handleVolunteerButtonClick}
          >
            {isVolunteer ? "Delete Volunteer" : "Volunteer"}
          </Button>
        </div>
      </div>

      {/* Get Help Dialog */}
      <Dialog open={getHelpDialogOpen} onOpenChange={setGetHelpDialogOpen}>
        <DialogContent className="w-full max-w-lg bg-white dark:bg-zinc-900 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-white">
              Request Assistance
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              Please fill in the details below to request help.
            </DialogDescription>
          </DialogHeader>
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
          <DialogClose />
        </DialogContent>
      </Dialog>

      {/* Volunteer Dialog */}
      <Dialog open={volunteerDialogOpen} onOpenChange={setVolunteerDialogOpen}>
        <DialogContent className="w-full max-w-lg bg-white dark:bg-zinc-900 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-white">
              Volunteer Application
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              Please fill in the details below to apply as a volunteer.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVolunteerSubmit} className="flex flex-col gap-4 mt-4">
            {/* Volunteer Types Section */}
            <div>
              <h3 className="text-lg font-medium mb-2">Types of Volunteer</h3>
              <div className="grid grid-cols-2 gap-2">
                {volunteerTypeOptions.map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={type}
                      checked={volunteerTypes.includes(type)}
                      onChange={() => {
                        if (volunteerTypes.includes(type)) {
                          setVolunteerTypes(volunteerTypes.filter((t) => t !== type));
                        } else {
                          setVolunteerTypes([...volunteerTypes, type]);
                        }
                      }}
                    />
                    <span className="text-sm">{type.replace(/_/g, " ")}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Skills Section */}
            <div>
              <h3 className="text-lg font-medium mb-2">Skills</h3>
              <input
                type="text"
                value={volunteerSkillInput}
                onChange={(e) => setVolunteerSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className="border p-2 rounded w-full"
              />
              <div className="flex flex-wrap mt-2 gap-2">
                {volunteerSkills.map((skill) => (
                  <div key={skill} className="flex items-center bg-gray-200 dark:bg-gray-700 rounded px-2 py-1">
                    <span className="text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-xs text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Volunteer Reason Section */}
            <div>
              <h3 className="text-lg font-medium mb-2">Reason for Volunteering</h3>
              <textarea
                value={volunteerReason}
                onChange={(e) => setVolunteerReason(e.target.value)}
                placeholder="Enter your reason for volunteering"
                className="border p-2 rounded w-full"
              ></textarea>
            </div>
            <Button type="submit" disabled={isVolunteerSubmitting}>
              {isVolunteerSubmitting ? "Submitting" : "Submit"}
            </Button>
          </form>
          <DialogClose />
        </DialogContent>
      </Dialog>
    </section>
  );
}
