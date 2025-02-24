"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pencil, ArrowLeft } from "lucide-react";
// Shadcn Dialog components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
// Import toast from sonner
import { toast } from "sonner";
import { GlowEffect } from "@/components/core/glow-effect";
import { TextShimmer } from "@/components/core/text-shimmer";
import { withAuth } from "@/app/_components/withAuth";
import { EditProfileFormWrapper } from "@/app/_components/EditProfileFormWrapper";

// Helper: Mask phone number (e.g., "1234567890" → "12******90")
function maskPhoneNumber(phone: string): string {
  if (!phone) return "";
  if (phone.length < 4) return phone;
  const firstTwo = phone.slice(0, 2);
  const lastTwo = phone.slice(-2);
  const middle = phone.length - 4;
  return `${firstTwo}${"*".repeat(middle)}${lastTwo}`;
}

function ProfileCard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);
  const handleDarkModeToggle = (checked: boolean) => {
    setIsDark(checked);
    setTheme(checked ? "dark" : "light");
  };

  // User profile state (fetched from API)
  const [userProfile, setUserProfile] = useState({
    name: "Default User",
    email: "user@gmail.com",
    role: "USER",
    phone: "",
    area: "",
    bio: "",
    avatarUrl: null as string | null,
  });
  // Dialog open state
  const [open, setOpen] = useState(false);

  // Fetch profile data from API
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/");
      return;
    }
    axios
      .get("http://localhost:8081/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;
        setUserProfile({
          name: data.name || "Default User",
          email: data.email || "user@gmail.com",
          role: data.roles && data.roles.length > 0 ? data.roles[0] : "USER",
          phone: data.phone || "",
          area: data.area || "",
          bio: data.bio || "",
          avatarUrl: data.profilePicture || null,
        });
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        router.push("/");
      });
  }, [router]);

  // Handle profile save (merge updated fields and show toast)
  // The edit form sends a removeAvatar flag when the avatar is removed.
  const handleProfileSave = (data: {
    name?: string;
    phone?: string;
    area?: string;
    bio?: string;
    profilePicture?: File | null;
    removeAvatar?: boolean;
  }) => {
    setUserProfile((prev) => {
      let newAvatarUrl = prev.avatarUrl;
      if (data.removeAvatar) {
        newAvatarUrl = null;
      } else if (data.profilePicture) {
        newAvatarUrl = URL.createObjectURL(data.profilePicture);
      }
      const updatedName =
        data.name && data.name.trim() !== "" ? data.name : "Default User";
      return {
        ...prev,
        name: updatedName,
        phone: data.phone?.trim() || "",
        area: data.area?.trim() || "",
        bio: data.bio?.trim() || "",
        avatarUrl: newAvatarUrl,
      };
    });
    toast("Profile updated", {
      description: "Your profile has been updated successfully.",
    });
    setOpen(false);
  };

  // Determine fallback letter:
  // If a valid name exists, use its first letter; otherwise, use the first letter of the email.
  const fallbackLetter = userProfile.name && userProfile.name.trim() !== ""
    ? userProfile.name.charAt(0).toUpperCase()
    : userProfile.email.charAt(0).toUpperCase();

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background py-8">
        {/* Back Button */}
        <div className="px-6 relative">
          <Link href="/" className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative inline-block">
                  <GlowEffect
                    colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
                    mode="colorShift"
                    blur="soft"
                    duration={3}
                    scale={1}
                  />
                  <Button
                    variant="outline"
                    size="default"
                    className="relative flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Back
                    </span>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>Go Back</TooltipContent>
            </Tooltip>
          </Link>
        </div>
        {/* Profile Card */}
        <div className="flex-grow flex items-center justify-center">
          <Card className="relative w-full max-w-md p-8 bg-card text-foreground rounded-lg shadow-lg">
            {/* Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <Pencil className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent
                className={[
                  "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  "w-full max-w-md border border-border bg-card text-card-foreground p-6 rounded-lg shadow-xl",
                  "max-h-[calc(100vh-4rem)] overflow-auto",
                ].join(" ")}
              >
                <DialogTitle className="sr-only">Edit Profile</DialogTitle>
                <EditProfileFormWrapper
                  userProfile={userProfile}
                  onSaveProfile={handleProfileSave}
                />
                <DialogClose className="absolute right-4 top-4 text-muted-foreground" />
              </DialogContent>
            </Dialog>
            {/* Profile Content */}
            <div className="flex flex-col items-center space-y-6">
              {/* Avatar */}
              <Avatar className="w-24 h-24">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-muted text-primary text-3xl font-bold">
                    {fallbackLetter}
                  </AvatarFallback>
                )}
              </Avatar>
              {/* Main Info: Name, Email, Role */}
              <div className="flex flex-col items-center gap-2">
                <TextShimmer className="text-2xl font-bold" duration={1.5}>
                  {userProfile.name}
                </TextShimmer>
                <p className="text-muted-foreground text-sm">
                  {userProfile.email}
                </p>
                <p className="text-muted-foreground text-sm">
                  {`Role: ${userProfile.role}`}
                </p>
                {/* Additional Info: Phone, Area, Bio */}
                {(userProfile.phone || userProfile.area || userProfile.bio) && (
                  <div className="w-full grid grid-cols-2 gap-2 bg-muted/30 p-4 rounded-lg">
                    {userProfile.phone && (
                      <>
                        <div className="font-medium text-gray-700">Phone:</div>
                        <div className="text-gray-700">
                          {maskPhoneNumber(userProfile.phone)}
                        </div>
                      </>
                    )}
                    {userProfile.area && (
                      <>
                        <div className="font-medium text-gray-700">Area:</div>
                        <div className="text-gray-700">{userProfile.area}</div>
                      </>
                    )}
                    {userProfile.bio && (
                      <>
                        <div className="font-medium text-gray-700">Bio:</div>
                        <div className="text-gray-700">{userProfile.bio}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Separator className="my-6 border-t border-muted-foreground" />
            {/* System Actions */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode-switch" className="text-sm">
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode-switch"
                  className="ml-2"
                  checked={isDark}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
              <Button variant="outline" className="w-full">
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}


export default withAuth(ProfileCard);