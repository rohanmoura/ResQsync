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

    const [openUserEdit, setOpenUserEdit] = useState(false);
    const [openVolunteerEdit, setOpenVolunteerEdit] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // Determine if the user is a volunteer and/or a help requester.
    const isVolunteer = userProfile.roles.includes("VOLUNTEER");
    const isHelpRequester = userProfile.roles.includes("HELPREQUESTER");

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

    // Save basic user details (unchanged)
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
                formData.append("removeAvatar", "true");
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
                name: updatedData.name || prev.name,
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

    const handleVolunteerSave = async (data: any) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                router.push("/");
                return;
            }

            // Clean volunteer types to remove unwanted prefixes so that the backend receives valid enum values.
            const cleanVolunteerTypes = (types: any): string[] => {
                if (!types) return [];
                let cleaned: string[] = [];
                if (Array.isArray(types)) {
                    types.forEach((t: string) => {
                        let val = t.trim();
                        if (val.startsWith("[")) val = val.substring(1);
                        if (val.endsWith("]")) val = val.substring(0, val.length - 1);
                        if (val.includes(",")) {
                            val.split(",").forEach((part) => {
                                let cleanPart = part.trim();
                                if (cleanPart.startsWith("Volunteer.type.")) {
                                    cleanPart = cleanPart.replace("Volunteer.type.", "");
                                } else if (cleanPart.startsWith("VolunterrTypes.")) {
                                    cleanPart = cleanPart.replace("VolunterrTypes.", "");
                                }
                                cleaned.push(cleanPart);
                            });
                        } else {
                            if (val.startsWith("Volunteer.type.")) {
                                val = val.replace("Volunteer.type.", "");
                            } else if (val.startsWith("VolunterrTypes.")) {
                                val = val.replace("VolunterrTypes.", "");
                            }
                            cleaned.push(val);
                        }
                    });
                }
                return Array.from(new Set(cleaned));
            };

            const cleanedVolunteerTypes: string[] = cleanVolunteerTypes(data.volunteeringTypes);
            const cleanedSkills: string[] = Array.from(new Set(data.skills || []));
            const cleanedAbout: string = data.about?.trim() || "";

            // If all volunteer fields are empty, simply close the form and show a toast.
            if (cleanedVolunteerTypes.length === 0 && cleanedSkills.length === 0 && cleanedAbout === "") {
                toast("No volunteer details provided. Nothing to update.");
                setOpenVolunteerEdit(false);
                return;
            }

            // Check if any changes have been made
            if (
                JSON.stringify(userProfile.volunteeringTypes) === JSON.stringify(cleanedVolunteerTypes) &&
                JSON.stringify(userProfile.skills) === JSON.stringify(cleanedSkills) &&
                userProfile.about === cleanedAbout
            ) {
                toast("No changes detected", {
                    description: "Your volunteer details are already up to date.",
                });
                setOpenVolunteerEdit(false);
                return;
            }

            // API call only if there are changes.
            await axios.post(
                "http://localhost:8081/api/volunteers/update",
                {
                    volunteeringTypes: cleanedVolunteerTypes,
                    skills: cleanedSkills,
                    about: cleanedAbout,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    validateStatus: (status) => status < 500, // allow 304 responses to be handled here
                }
            ).then((response) => {
                // If a 304 Not Modified is returned, simply treat it as no change.
                if (response.status === 304) {
                    toast("No changes detected", {
                        description: "Your volunteer details are already up to date.",
                    });
                    setOpenVolunteerEdit(false);
                    return;
                }
                // Otherwise, update the state with new volunteer details.
                setUserProfile((prev) => ({
                    ...prev,
                    volunteeringTypes: [...cleanedVolunteerTypes],
                    skills: [...cleanedSkills],
                    about: cleanedAbout,
                }));
                toast("Volunteer profile updated", {
                    description: "Your volunteer details have been updated successfully.",
                });
                setOpenVolunteerEdit(false);
            });
        } catch (error: any) {
            // If we catch an error and it's a 304, handle it here as well.
            if (error.response && error.response.status === 304) {
                toast("No changes detected", {
                    description: "Your volunteer details are already up to date.",
                });
                setOpenVolunteerEdit(false);
                return;
            }
            console.error("Error updating volunteer profile:", error);
            toast.error("Failed to update volunteer details. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                router.push("/");
                return;
            }
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

    // New function to delete help requests for help requester role.
    const handleDeleteHelpRequests = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                router.push("/");
                return;
            }
            await axios.delete("http://localhost:8081/api/help-requests/deletehelprequestorrole", {
                headers: { Authorization: `Bearer ${token}` },
                params: { email: userProfile.email },
            });
            toast("Help requests deleted", {
                description: "Your help requests have been deleted successfully.",
            });
            window.location.reload();
        } catch (error) {
            console.error("Error deleting help requests:", error);
            toast.error("Failed to delete help requests");
        }
    };
    


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

    return (
        <TooltipProvider>
            <div className="min-h-screen flex flex-col bg-background py-8">
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
                                        <span className="text-sm font-medium text-muted-foreground">Back</span>
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>Go Back</TooltipContent>
                        </Tooltip>
                    </Link>
                </div>

                <div className="flex-grow flex items-center justify-center">
                    <Card className="relative w-full max-w-md p-8 bg-card text-foreground rounded-lg shadow-lg">
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

                        {/* Render volunteer edit dialog only if the user is a volunteer and not a help requester */}
                        {isVolunteer && !isHelpRequester &&
                            ((userProfile.volunteeringTypes.length > 0) ||
                                (userProfile.skills.length > 0) ||
                                (userProfile.about && userProfile.about.trim() !== "")) && (
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
                            )
                        }

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
                                {/* Render volunteer details only if the user is a volunteer and not a help requester */}
                                {isVolunteer && !isHelpRequester &&
                                    ((userProfile.volunteeringTypes.length > 0) ||
                                        (userProfile.skills.length > 0) ||
                                        (userProfile.about && userProfile.about.trim() !== "")) && (
                                        <div className="w-full relative grid grid-cols-2 gap-2 bg-muted/30 p-4 rounded-lg mt-4">
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
                                                        {userProfile.volunteeringTypes
                                                            .flatMap((typeEntry) => {
                                                                let cleaned = typeEntry.replace(/^\[|\]$/g, "");
                                                                let splitted = cleaned.split(",");
                                                                return splitted.map((s) =>
                                                                    s
                                                                        .trim()
                                                                        .replace("VolunterrTypes.", "")
                                                                        .replace(/_/g, " ")
                                                                );
                                                            })
                                                            .join(", ")}
                                                    </div>
                                                </>
                                            )}
                                            {userProfile.skills && userProfile.skills.length > 0 && (
                                                <>
                                                    <div className="font-medium text-gray-700">Skills:</div>
                                                    <div className="text-gray-700">{userProfile.skills.join(", ")}</div>
                                                </>
                                            )}
                                            {userProfile.about && userProfile.about.trim() !== "" && (
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
                            {/* Render the delete help requests button if the user is a help requester */}
                            {isHelpRequester && (
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={handleDeleteHelpRequests}
                                >
                                    Delete Help Requests
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => setOpenDeleteDialog(true)}
                            >
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
