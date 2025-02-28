"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { TextEffect } from "@/components/core/text-effect";
import { TextLoop } from "@/components/core/text-loop";
import ActionDropdown, { ActionItem } from "@/components/landing/ActionDropdown";
import { InView } from "../core/in-view";

type UserProfile = {
  name: string;
  email: string;
  roles: string[];
  phone: string;
  area: string;
  bio: string;
  profilePicture: string | null;
};

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Dialog open states
  const [getHelpDialogOpen, setGetHelpDialogOpen] = useState(false);
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);
  const [hospitalDialogOpen, setHospitalDialogOpen] = useState(false);

  // Form states for Get Help
  const [helpType, setHelpType] = useState("");
  const [description, setHelpDescription] = useState("");

  // Form states for Volunteer
  const [volunteerReason, setVolunteerReason] = useState("");
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
  const [isGetHelpSubmitting, setIsGetHelpSubmitting] = useState(false);
  const [isVolunteerDeleting, setIsVolunteerDeleting] = useState(false);

  // Form states for Hospital
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [isHospitalSubmitting, setIsHospitalSubmitting] = useState(false);

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
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const isVolunteer = userProfile?.roles?.includes("VOLUNTEER") ?? false;
  const isHelpRequester = userProfile?.roles?.includes("HELPREQUESTER") ?? false;

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
    if (userProfile.roles.includes("VOLUNTEER")) {
      toast.error(
        "You are currently a volunteer so you cannot request help. Please remove your volunteer role to request help."
      );
      return;
    }
    if (userProfile.roles.includes("HOSPITAL")) {
      toast.error("You already have a hospital role, you cannot request help.");
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
    if (userProfile.roles.includes("HELPREQUESTER")) {
      toast.error(
        "You are currently a help requester so you cannot volunteer. Please remove your help requester role to volunteer."
      );
      return;
    }
    if (userProfile.roles.includes("HOSPITAL")) {
      toast.error("You already have a hospital role, you cannot volunteer.");
      return;
    }
    setVolunteerDialogOpen(true);
  };

  const handleHospitalButtonClick = () => {
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "To view hospital info, please sign up first.",
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
        `Please fill your ${missing.join(", ")} details before accessing hospital information.`
      );
      return;
    }
    setHospitalDialogOpen(true);
  };

  const handleDeleteVolunteer = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast("Authentication Required", {
        description: "Please sign in first.",
      });
      return;
    }
    setIsVolunteerDeleting(true);
    try {
      await axios.delete(
        "http://localhost:8081/api/volunteers/deletevolunteerrole",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { email: userProfile?.email },
        }
      );
      toast.success("Volunteer role removed successfully!");
      if (userProfile?.roles) {
        setUserProfile({
          ...userProfile,
          roles: userProfile.roles.filter((role) => role !== "VOLUNTEER"),
        });
      }
      window.location.reload();
    } catch (error) {
      toast.error("Failed to remove volunteer role. Please try again.");
    } finally {
      setIsVolunteerDeleting(false);
    }
  };

  const subscribeToNotifications = (email: string) => {
    const sseUrl = `http://localhost:8081/api/notifications/subscribe?email=${encodeURIComponent(
      email
    )}`;
    const eventSource = new EventSource(sseUrl);
    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        console.log("New notification received:", notification);
      } catch (error) {
        console.error("Error parsing notification data:", error);
      }
    };
    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };
    return eventSource;
  };

  const handleGetHelpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!helpType.trim()) {
      toast.error("Please fill the type of help.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please fill the description of help.");
      return;
    }
    setIsGetHelpSubmitting(true);
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8081/api/help-requests/submit",
        { helpType, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Help request submitted successfully!");
      setGetHelpDialogOpen(false);
      setHelpType("");
      setHelpDescription("");
      if (!sessionStorage.getItem("helpRequestReloaded")) {
        sessionStorage.setItem("helpRequestReloaded", "true");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to submit help request. Please try again.");
    } finally {
      setIsGetHelpSubmitting(false);
    }
  };

  const handleVolunteerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (volunteerTypes.length === 0) {
      toast.error("Please select at least one type of volunteer support.");
      return;
    }
    if (volunteerSkills.length === 0) {
      toast.error("Please add at least one skill.");
      return;
    }
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
      setVolunteerDialogOpen(false);
      setVolunteerTypes([]);
      setVolunteerSkills([]);
      setVolunteerSkillInput("");
      setVolunteerReason("");
      localStorage.setItem("isVolunteer", "true");
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          roles: userProfile.roles.includes("VOLUNTEER")
            ? userProfile.roles
            : [...userProfile.roles, "VOLUNTEER"],
        };
        setUserProfile(updatedProfile);
        if (
          updatedProfile.email &&
          updatedProfile.roles.includes("VOLUNTEER") &&
          updatedProfile.roles.includes("USER")
        ) {
          subscribeToNotifications(updatedProfile.email);
        }
      }
      window.location.reload();
    } catch (error) {
      toast.error("Failed to submit volunteer application. Please try again.");
    } finally {
      setIsVolunteerSubmitting(false);
    }
  };

  const handleHospitalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate that all fields are filled
    if (
      !registrationNumber ||
      !hospitalName ||
      !address ||
      !city ||
      !stateField ||
      !zipCode ||
      !officialEmail ||
      !phone ||
      !website
    ) {
      toast.error("Please fill all field details.");
      setHospitalDialogOpen(false);
      return;
    }
    setIsHospitalSubmitting(true);
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8081/api/hospitals/addHospital",
        {
          registrationNumber,
          hospitalName,
          address,
          city,
          state: stateField,
          zipCode,
          officialEmail,
          phone,
          website,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Hospital role Created Successfully!");
      // Update user profile to include HOSPITAL role if not already there
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          roles: userProfile.roles.includes("HOSPITAL")
            ? userProfile.roles
            : [...userProfile.roles, "HOSPITAL"],
        };
        setUserProfile(updatedProfile);
      }
      setHospitalDialogOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create hospital role. Please try again.");
    } finally {
      setIsHospitalSubmitting(false);
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

  // Prepare dropdown actions using the existing handlers
  const dropdownActions: ActionItem[] = [
    {
      label: "Hospital",
      onClick: handleHospitalButtonClick,
    },
    {
      label: "Get Help",
      onClick: handleGetHelpButtonClick,
    },
    {
      label: isVolunteer
        ? isVolunteerDeleting
          ? "Deleting..."
          : "Delete Volunteer"
        : "Volunteer",
      onClick: isVolunteer ? handleDeleteVolunteer : handleVolunteerButtonClick,
      disabled: isVolunteer ? isVolunteerDeleting : false,
    },
  ];

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
            <span>: Crisis Response Reinvented</span>
            <span>: Smarter Emergency Care</span>
            <span>: Bridging Help & Hope</span>
            <span>: AI-Powered Assistance</span>
          </TextLoop>
        </h1>
        <TextEffect
          as="p"
          per="word"
          preset="fade-in-blur"
          className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto dark:text-gray-300 text-gray-700"
        >
          Connecting hospitals, responders, and volunteers for real-time emergency support.
        </TextEffect>
        {/* Use the dropdown component instead of two separate buttons */}
        <div className="flex items-center justify-center mt-6">
          <ActionDropdown actions={dropdownActions} triggerLabel="Choose Your Role" />
        </div>
      </div>

      {/* Hospital Dialog with Form */}
      <Dialog open={hospitalDialogOpen} onOpenChange={setHospitalDialogOpen}>
        <DialogContent className="w-full max-w-lg bg-white dark:bg-zinc-900 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-white">
              Hospital Information
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              Please fill in the hospital details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleHospitalSubmit} className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="State"
              value={stateField}
              onChange={(e) => setStateField(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Official Email"
              value={officialEmail}
              onChange={(e) => setOfficialEmail(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="border p-2 rounded"
            />
            <Button type="submit">
              {isHospitalSubmitting ? "Submitting" : "Submit"}
            </Button>
          </form>
          <DialogClose />
        </DialogContent>
      </Dialog>

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
              value={description}
              onChange={(e) => setHelpDescription(e.target.value)}
              placeholder="Description of Help"
              className="border p-2 rounded"
            ></textarea>
            <Button type="submit" disabled={isGetHelpSubmitting}>
              {isGetHelpSubmitting ? "Submitting" : "Submit"}
            </Button>
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
