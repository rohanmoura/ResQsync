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
import { withAuth } from "@/app/_components/withAuth"; // Import the HOC
import { jwtDecode } from "jwt-decode"; // For decoding JWT token

function ProfilePage() {
    // const [userData, setUserData] = useState({
    //     name: "",
    //     email: "",
    //     bio: "",
    //     avatar: "",
    // });

    // const router = useRouter();

    // useEffect(() => {
    //     const token = localStorage.getItem("jwtToken");
    //     if (!token) {
    //         router.push("/"); // Redirect to landing page if not authenticated
    //         return;
    //     }

    //     try {
    //         const decodedToken: any = jwtDecode(token);
    //         setUserData({
    //             name: decodedToken.name || "Default User", // Fallback to default if missing
    //             email: decodedToken.email || "user@example.com",
    //             bio: decodedToken.bio || "",
    //             avatar: decodedToken.avatar || "",
    //         });
    //     } catch (error) {
    //         console.error("Invalid token:", error);
    //         localStorage.removeItem("jwtToken");
    //         router.push("/");
    //     }
    // }, [router]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Profile Header */}
            <Card>
                <CardHeader className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl font-semibold">User</CardTitle>
                        <p className="text-muted-foreground text-sm">user@gmail.com</p>
                    </div>
                </CardHeader>
            </Card>

            {/* User Info Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" disabled />
                    </div>
                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" disabled />
                    </div>
                </CardContent>
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

export default ProfilePage;
