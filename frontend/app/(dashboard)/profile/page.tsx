"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Pencil } from "lucide-react";
import { EditVolunteerProfileForm } from "@/components/forms/EditVolunteerProfileForm";
import { Avatar } from "@/components/ui/avatar";
import { withAuth } from "@/app/_components/withAuth";
import { toast } from "sonner";
import { EditProfileFormWrapper } from "@/app/_components/EditProfileFormWrapper";
import { useTheme } from "next-themes";
import { TextShimmer } from "@/components/core/text-shimmer";
import { GlowEffect } from "@/components/core/glow-effect";

// Import AlertDialog components for delete account confirmation
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { EditVolunteerProfileFormWrapper } from "@/app/_components/EditVolunteerProfileFormWrapper";

// Helper: Mask phone number
function maskPhoneNumber(phone: string): string {
    if (!phone) return "";
    if (phone.length < 4) return phone;
    return `${phone.slice(0, 2)}${"*".repeat(phone.length - 4)}${phone.slice(-2)}`;
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

    const [userProfile, setUserProfile] = useState({
        name: "Default User",
        email: "user@gmail.com",
        roles: ["USER"],
        phone: "",
        area: "",
        bio: "",
        profilePicture: null as string | null,
        volunteeringTypes: [] as string[],
        skills: [] as string[],
        about: "",
    });

    // Two separate dialog states for editing basic info and volunteer details:
    const [openUserEdit, setOpenUserEdit] = useState(false);
    const [openVolunteerEdit, setOpenVolunteerEdit] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
                    roles: data.roles && data.roles.length > 0 ? data.roles : ["USER"],
                    phone: data.phone || "",
                    area: data.area || "",
                    bio: data.bio || "",
                    profilePicture: data.profilePicture || null,
                    volunteeringTypes: data.volunteeringTypes || [],
                    skills: data.skills || [],
                    about: data.about || "",
                });
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
                router.push("/");
            });
    }, [router]);

    // Save basic user details
    const handleProfileSave = async (data: any) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                router.push("/");
                return;
            }

            const updateDto = {
                name: data.name ?? "",
                phone: data.phone ?? "",
                area: data.area ?? "",
                bio: data.bio ?? "",
            };

            const formData = new FormData();
            formData.append("updateDto", JSON.stringify(updateDto));

            if (data.removeAvatar) {
                formData.append("removeAvatar", "true"); // Explicitly mark for removal
            } else if (data.profilePicture) {
                formData.append("profilePicture", data.profilePicture);
            }

            const response = await axios.post(
                "http://localhost:8081/api/user/update-profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const updatedData = response.data;

            setUserProfile((prev) => ({
                ...prev,
                name: updatedData.name || prev.name, // Preserve name update
                phone: updatedData.phone || prev.phone,
                area: updatedData.area || prev.area,
                bio: updatedData.bio || prev.bio,
                profilePicture: data.removeAvatar ? null : updatedData.profilePicture || prev.profilePicture,
            }));

            toast("Profile updated", {
                description: "Your profile has been updated successfully.",
            });

            setOpenUserEdit(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };


    // Save volunteer-specific details
    const handleVolunteerSave = async (data: any) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                router.push("/");
                return;
            }
            // Ensure volunteeringTypes is an array of clean strings
            const volunteeringTypes = Array.isArray(data.volunteeringTypes)
                ? data.volunteeringTypes.map((type: string) => type.trim())
                : data.volunteeringTypes.split(",").map((s: string) => s.trim());

            const updateVolunteerDto = {
                volunteeringTypes: volunteeringTypes,
                skills: data.skills || [],
                about: data.about || "",
            };
            // Use dedicated endpoint for volunteer details.
            const response = await axios.post(
                "http://localhost:8081/api/volunteers/update",
                updateVolunteerDto,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const updatedData = response.data;
            setUserProfile((prev) => ({
                ...prev,
                volunteeringTypes: updatedData.volunteeringTypes || [],
                skills: updatedData.skills || [],
                about: updatedData.about || "",
            }));
            toast("Volunteer profile updated", {
                description: "Your volunteer details have been updated successfully.",
            });
            setOpenVolunteerEdit(false);
        } catch (error) {
            console.error("Error updating volunteer profile:", error);
            toast.error("Failed to update volunteer details");
        }
    };


    // Delete account with alert dialog confirmation
    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                router.push("/");
                return;
            }
            // Remove tokens before deletion
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("jwtExp");
            await axios.delete("http://localhost:8081/api/user/delete", {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast("Account deleted", {
                description: "Your account has been deleted successfully.",
            });
            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Failed to delete account");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("jwtExp");
        toast("Logged out", {
            description: "You have been logged out successfully.",
        });
        router.push("/");
    };

    // Improved image resolution logic:
    const resolvedAvatarUrl = userProfile.profilePicture
        ? userProfile.profilePicture.startsWith("http") || userProfile.profilePicture.startsWith("blob:")
            ? userProfile.profilePicture
            : userProfile.profilePicture.length > 100
                ? userProfile.profilePicture.startsWith("/9j/")
                    ? `data:image/jpeg;base64,${userProfile.profilePicture}`
                    : `data:image/png;base64,${userProfile.profilePicture}`
                : `http://localhost:8081/${userProfile.profilePicture}`
        : null;

    const fallbackLetter =
        userProfile.name && userProfile.name.trim() !== ""
            ? userProfile.name.charAt(0).toUpperCase()
            : userProfile.email.charAt(0).toUpperCase();

    const isVolunteer = userProfile.roles.includes("VOLUNTEER");

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
                                    <Button variant="outline" size="default" className="relative flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800">
                                        <ArrowLeft className="w-5 h-5" />
                                        <span className="text-sm font-medium text-muted-foreground">Back</span>
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
                        {/* User Edit Pencil with Tooltip */}
                        <div className="absolute top-4 right-12">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setOpenUserEdit(true)}
                                        className="hover:bg-gray-200 dark:hover:bg-gray-800"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Profile</TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Basic User Edit Dialog */}
                        <Dialog open={openUserEdit} onOpenChange={setOpenUserEdit}>
                            <DialogTrigger asChild>
                                <div />
                            </DialogTrigger>
                            <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md border border-border bg-card text-card-foreground p-6 rounded-lg shadow-xl max-h-[calc(100vh-4rem)] overflow-auto">
                                <DialogTitle className="sr-only">Edit Profile</DialogTitle>
                                <EditProfileFormWrapper
                                    onSaveProfile={handleProfileSave}
                                    userProfile={{
                                        name: userProfile.name,
                                        email: userProfile.email,
                                        roles: userProfile.roles,
                                        phone: userProfile.phone,
                                        area: userProfile.area,
                                        bio: userProfile.bio,
                                        avatarUrl: userProfile.profilePicture,
                                    }}
                                />
                                <DialogClose className="absolute right-4 top-4 text-muted-foreground" />
                            </DialogContent>
                        </Dialog>

                        {/* Volunteer Edit Dialog */}
                        {isVolunteer && (
                            <Dialog open={openVolunteerEdit} onOpenChange={setOpenVolunteerEdit}>
                                <DialogTrigger asChild>
                                    <div />
                                </DialogTrigger>
                                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md border border-border bg-card text-card-foreground p-6 rounded-lg shadow-xl max-h-[calc(100vh-4rem)] overflow-auto">
                                    <DialogTitle className="sr-only">Edit Volunteer Details</DialogTitle>
                                    <EditVolunteerProfileFormWrapper
                                        onSaveProfile={handleVolunteerSave}
                                        userProfile={{
                                            volunteeringTypes: userProfile.volunteeringTypes,
                                            skills: userProfile.skills,
                                            about: userProfile.about,
                                        }}
                                    />
                                    <DialogClose className="absolute right-4 top-4 text-muted-foreground" />
                                </DialogContent>
                            </Dialog>
                        )}

                        {/* Delete Account Alert Dialog */}
                        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                            <AlertDialogTrigger asChild>
                                <div />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm border border-border bg-card text-card-foreground p-6 rounded-lg shadow-xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Profile Content */}
                        <div className="flex flex-col items-center space-y-6 mt-8">
                            <Avatar className="w-24 h-24 flex items-center justify-center bg-muted rounded-full overflow-hidden">
                                {resolvedAvatarUrl ? (
                                    <img
                                        src={resolvedAvatarUrl}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-primary">
                                        {fallbackLetter}
                                    </div>
                                )}
                            </Avatar>
                            <div className="flex flex-col items-center gap-2">
                                <TextShimmer className="text-2xl font-bold" duration={1.5}>
                                    {userProfile.name}
                                </TextShimmer>
                                <p className="text-muted-foreground text-sm">{userProfile.email}</p>
                                <p className="text-muted-foreground text-sm">{`Role: ${userProfile.roles.join(", ")}`}</p>
                                {(userProfile.phone || userProfile.area || userProfile.bio) && (
                                    <div className="w-full grid grid-cols-2 gap-2 bg-muted/30 p-4 rounded-lg">
                                        {userProfile.phone && (
                                            <>
                                                <div className="font-medium text-gray-700">Phone:</div>
                                                <div className="text-gray-700">{maskPhoneNumber(userProfile.phone)}</div>
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
                                {/* Volunteer Details Section – expands the card dynamically */}
                                {isVolunteer && (
                                    userProfile.volunteeringTypes.length > 0 ||
                                    userProfile.skills.length > 0 ||
                                    userProfile.about
                                ) && (
                                        <div className="w-full relative grid grid-cols-2 gap-2 bg-muted/30 p-4 rounded-lg mt-4">
                                            {/* Step: Add the volunteer pencil up top-right */}
                                            <div className="absolute top-2 right-2">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setOpenVolunteerEdit(true)}
                                                            className="hover:bg-gray-200 dark:hover:bg-gray-800"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Edit Volunteer Details</TooltipContent>
                                                </Tooltip>
                                            </div>
                                            {userProfile.volunteeringTypes && userProfile.volunteeringTypes.length > 0 && (
                                                <>
                                                    <div className="font-medium text-gray-700">Volunteer Types:</div>
                                                    <div className="text-gray-700">
                                                        {
                                                            // Transform each array entry, remove bracket notation, etc.
                                                            userProfile.volunteeringTypes
                                                                .flatMap((typeEntry) => {
                                                                    // 1) Remove any leading/trailing brackets
                                                                    let cleaned = typeEntry.replace(/^\[|\]$/g, "");
                                                                    // 2) Split by commas
                                                                    let splitted = cleaned.split(",");
                                                                    // 3) Clean each piece (remove prefix and underscores)
                                                                    return splitted.map((s) =>
                                                                        s
                                                                            .trim()
                                                                            .replace("VolunterrTypes.", "") // remove "VolunterrTypes."
                                                                            .replace(/_/g, " ") // replace underscores with spaces
                                                                    );
                                                                })
                                                                .join(", ")
                                                        }
                                                    </div>
                                                </>
                                            )}
                                            {userProfile.skills && userProfile.skills.length > 0 && (
                                                <>
                                                    <div className="font-medium text-gray-700">Skills:</div>
                                                    <div className="text-gray-700">{userProfile.skills.join(", ")}</div>
                                                </>
                                            )}
                                            {userProfile.about && (
                                                <>
                                                    <div className="font-medium text-gray-700">Volunteer Reason:</div>
                                                    <div className="text-gray-700">{userProfile.about}</div>
                                                </>
                                            )}
                                        </div>
                                    )}

                            </div>
                        </div>

                        <Separator className="my-6 border-t border-muted-foreground" />

                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="dark-mode-switch" className="text-sm">Dark Mode</Label>
                                <Switch id="dark-mode-switch" className="ml-2" checked={isDark} onCheckedChange={handleDarkModeToggle} />
                            </div>
                            {/* Delete Account Button – triggers alert dialog */}
                            <Button variant="destructive" className="w-full" onClick={() => setOpenDeleteDialog(true)}>
                                Delete Account
                            </Button>
                            <Button variant="outline" className="w-full" onClick={handleLogout}>
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
