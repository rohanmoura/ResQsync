"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { withAuth } from "@/app/_components/withAuth";
import { Pencil, Upload } from "lucide-react";

function ProfilePage() {
    const [userData, setUserData] = useState({
        name: "Default User",
        email: "user@example.com",
        bio: "",
        profilePicture: "",
        phone: "",
        area: "",
        role: "User",
    });

    const [editData, setEditData] = useState({
        name: "",
        bio: "",
        profilePicture: "",
        phone: "",
        area: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

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
                setUserData({
                    name: data.name || "Default User",
                    email: data.email || "user@example.com",
                    bio: data.bio || "",
                    profilePicture: data.profilePicture || "",
                    phone: data.phone ? maskPhone(data.phone) : "",
                    area: data.area || "",
                    role: "User",
                });
                setEditData({
                    name: data.name || "",
                    bio: data.bio || "",
                    profilePicture: data.profilePicture || "",
                    phone: data.phone || "",
                    area: data.area || "",
                });
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
                router.push("/");
            });
    }, [router]);

    // Mask phone number: e.g., "72++++++29"
    const maskPhone = (phone: string) => {
        return phone.replace(/(\d{2})\d+(\d{2})/, "$1++++++$2");
    };

    // Update userData with editData on Save
    const handleSave = () => {
        setUserData({
            ...userData,
            ...editData,
            phone: maskPhone(editData.phone),
        });
        setIsEditing(false);
    };

    return (
        <TooltipProvider>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Profile Header Card */}
                <Card>
                    <CardHeader className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                            {userData.profilePicture ? (
                                <AvatarImage src={userData.profilePicture} alt={userData.name} />
                            ) : (
                                <AvatarFallback>
                                    {userData.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-xl font-semibold">
                                {userData.name}
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">
                                {userData.email}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Role: {userData.role}
                            </p>
                            {userData.phone && (
                                <p className="text-muted-foreground text-sm">
                                    Phone: {userData.phone}
                                </p>
                            )}
                            {userData.area && (
                                <p className="text-muted-foreground text-sm">
                                    Area: {userData.area}
                                </p>
                            )}
                            {userData.bio && (
                                <p className="text-muted-foreground text-sm">
                                    {userData.bio}
                                </p>
                            )}
                        </div>

                        {/* Edit Button with Tooltip & Popover */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Popover open={isEditing} onOpenChange={setIsEditing}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-gray-200 dark:hover:bg-gray-800"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-4">
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="edit-name">Name</Label>
                                                <Input
                                                    id="edit-name"
                                                    value={editData.name}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, name: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="edit-bio">Bio</Label>
                                                <Textarea
                                                    id="edit-bio"
                                                    value={editData.bio}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, bio: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="edit-phone">Phone</Label>
                                                <Input
                                                    id="edit-phone"
                                                    value={editData.phone}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, phone: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="edit-area">Area</Label>
                                                <Input
                                                    id="edit-area"
                                                    value={editData.area}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, area: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label>Profile Picture</Label>
                                                <div className="flex gap-2 items-center">
                                                    <Button variant="outline">
                                                        <Upload className="w-4 h-4" /> Upload
                                                    </Button>
                                                    {/* Hidden file input; integrate file upload logic as needed */}
                                                    <Input type="file" className="hidden" />
                                                </div>
                                            </div>
                                            <Button onClick={handleSave}>Save Changes</Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TooltipTrigger>
                            <TooltipContent>Edit Profile</TooltipContent>
                        </Tooltip>
                    </CardHeader>
                </Card>
            </div>
        </TooltipProvider>
    );
}

export default withAuth(ProfilePage);
