"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { withAuth } from "@/app/_components/withAuth"; // Import the HOC
import { jwtDecode } from "jwt-decode"; // For decoding JWT token
import { Pencil } from "lucide-react";

function ProfilePage() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        avatar: "",
    });

    const [editData, setEditData] = useState({
        name: "",
        bio: "",
        avatar: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/"); // Redirect to landing page if not authenticated
            return;
        }

        try {
            const decodedToken: any = jwtDecode(token);
            setUserData({
                name: decodedToken.name || "Default User",
                email: decodedToken.email || "user@example.com",
                avatar: decodedToken.avatar || "",
            });

            // Set editData initially to userData
            setEditData({
                name: decodedToken.name || "Default User",
                bio: decodedToken.bio || "",
                avatar: decodedToken.avatar || "",
            });
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("jwtToken");
            router.push("/");
        }
    }, [router]);

    // Handle Save Changes
    const handleSave = () => {
        setUserData({ ...userData, ...editData });
        setIsEditing(false); // Close popover
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Profile Header */}
            <Card>
                <CardHeader className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                        {userData.avatar ? (
                            <AvatarImage src={userData.avatar} alt={userData.name} />
                        ) : (
                            <AvatarFallback>U</AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-xl font-semibold">{userData.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">{userData.email}</p>
                    </div>

                    {/* Edit Button with Popover */}
                    <Popover open={isEditing} onOpenChange={setIsEditing}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-gray-200 dark:hover:bg-gray-800">
                                <Pencil className="w-5 h-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-bio">Bio</Label>
                                    <Textarea
                                        id="edit-bio"
                                        value={editData.bio}
                                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-avatar">Profile Image URL</Label>
                                    <Input
                                        id="edit-avatar"
                                        value={editData.avatar}
                                        onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                                    />
                                </div>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardHeader>
            </Card>

            {/* Account Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Dark Mode</Label>
                        <Switch />
                    </div>
                    <Separator />
                    <Button variant="destructive">Delete Account</Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default withAuth(ProfilePage);
