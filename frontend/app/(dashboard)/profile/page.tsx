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
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { GlowEffect } from "@/components/core/glow-effect";
import { TextShimmer } from "@/components/core/text-shimmer";
import { withAuth } from "@/app/_components/withAuth";
import { EditProfileFormWrapper } from "@/app/_components/EditProfileFormWrapper";
import { EditVolunteerProfileForm } from "@/components/forms/EditVolunteerProfileForm";

// Helper: Mask phone number
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

    // Two separate dialog states:
    const [openUserEdit, setOpenUserEdit] = useState(false);
    const [openVolunteerEdit, setOpenVolunteerEdit] = useState(false);

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
            // Prepare update for basic details
            const updateDto = {
                name: data.name ?? "",
                phone: data.phone ?? "",
                area: data.area ?? "",
                bio: data.bio ?? "",
            };
            const formData = new FormData();
            formData.append("updateDto", JSON.stringify(updateDto));
            if (!data.removeAvatar && data.profilePicture) {
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
            setUserProfile({
                name: updatedData.name || "Default User",
                email: updatedData.email || "user@gmail.com",
                roles:
                    updatedData.roles && updatedData.roles.length > 0
                        ? updatedData.roles
                        : ["USER"],
                phone: updatedData.phone || "",
                area: updatedData.area || "",
                bio: updatedData.bio || "",
                profilePicture: updatedData.profilePicture || null,
                // Preserve volunteer fields if any
                volunteeringTypes: updatedData.volunteeringTypes || userProfile.volunteeringTypes,
                skills: updatedData.skills || userProfile.skills,
                about: updatedData.about || userProfile.about,
            });
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
            const updateVolunteerDto = {
                volunteeringTypes: data.volunteeringTypes || [],
                skills: data.skills || [],
                about: data.about || "",
            };
            // Here you can use a dedicated endpoint for volunteer details if needed.
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

    const resolvedAvatarUrl = userProfile.profilePicture
        ? userProfile.profilePicture.startsWith("http")
            ? userProfile.profilePicture
            : userProfile.profilePicture.length > 100
                ? `data:image/png;base64,${userProfile.profilePicture}`
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
                        {/* Pencil icons for editing */}
                        <div className="absolute top-4 right-12">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpenUserEdit(true)}
                                className="hover:bg-gray-200 dark:hover:bg-gray-800"
                            >
                                <Pencil className="w-5 h-5" />
                            </Button>
                        </div>
                        {isVolunteer && (
                            <div className="absolute top-4 right-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setOpenVolunteerEdit(true)}
                                    className="hover:bg-gray-200 dark:hover:bg-gray-800"
                                >
                                    <Pencil className="w-5 h-5" />
                                </Button>
                            </div>
                        )}

                        {/* User Edit Dialog */}
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
                                    <EditVolunteerProfileForm onSaveProfile={handleVolunteerSave} userProfile={userProfile} />
                                    <DialogClose className="absolute right-4 top-4 text-muted-foreground" />
                                </DialogContent>
                            </Dialog>
                        )}

                        {/* Profile Content */}
                        <div className="flex flex-col items-center space-y-6">
                            <Avatar className="w-24 h-24">
                                {resolvedAvatarUrl ? (
                                    <img src={resolvedAvatarUrl} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <div className="bg-muted text-primary text-3xl font-bold">{fallbackLetter}</div>
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
                                {/* Volunteer Details Section */}
                                {isVolunteer && (
                                    <div className="w-full grid grid-cols-2 gap-2 bg-muted/30 p-4 rounded-lg mt-4">
                                        {userProfile.volunteeringTypes && userProfile.volunteeringTypes.length > 0 && (
                                            <>
                                                <div className="font-medium text-gray-700">Volunteer Types:</div>
                                                <div className="text-gray-700">{userProfile.volunteeringTypes.join(", ")}</div>
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
                            <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
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


