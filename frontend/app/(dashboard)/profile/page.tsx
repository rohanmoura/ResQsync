"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { withAuth } from "@/app/_components/withAuth"; // Import the HOC

function ProfilePage() {
    const [userData, setUserData] = useState({
        name: "Default User",
        email: "user@example.com",
        bio: "",
        profilePicture: "",
    });

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/"); // Redirect to landing page if not authenticated
            return;
        }

        // Fetch user profile data from API
        axios
            .get("http://localhost:8081/api/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`, // Send JWT token for authentication
                },
            })
            .then((response) => {
                const data = response.data;
                setUserData({
                    name: data.name || "Default User",
                    email: data.email || "user@example.com",
                    bio: data.bio || "No bio added.",
                    profilePicture: data.profilePicture || "", // Show fallback if null
                });
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                router.push("/"); // Redirect to home if error occurs
            });
    }, [router]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Profile Header */}
            <Card>
                <CardHeader className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                        {userData.profilePicture ? (
                            <AvatarImage src={userData.profilePicture} alt={userData.name} />
                        ) : (
                            <AvatarFallback>U</AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl font-semibold">{userData.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">{userData.email}</p>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}

export default withAuth(ProfilePage);
