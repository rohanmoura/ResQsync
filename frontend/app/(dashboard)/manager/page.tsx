"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type VolunteerProfileDto = {
    email: string;
    name: string;
    phone: string;
    area: string;
    bio: string;
    profilePicture: string; // Base64 string
    roles: string[];
    helpRequests: any[];
    volunteeringTypes?: string[]; // Made optional to prevent errors if undefined
    skills?: string[]; // Made optional for safe-checking
    about: string;
};

export default function ManagerPage() {
    const [volunteers, setVolunteers] = useState<VolunteerProfileDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVolunteers() {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await axios.get("http://localhost:8081/api/manager/volunteers", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setVolunteers(response.data);
            } catch (error) {
                console.error("Error fetching volunteers:", error);
                toast.error("Failed to load volunteers.");
            } finally {
                setLoading(false);
            }
        }
        fetchVolunteers();
    }, []);

    const handleVerify = async (email: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(`http://localhost:8081/api/manager/volunteers/verify/${email}`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            toast.success("Verify Done");
            console.log("Verified volunteer:", email);
        } catch (error) {
            console.error("Error verifying volunteer:", error);
            toast.error("Verification failed");
        }
    };

    const handleNonVerify = async (email: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(`http://localhost:8081/api/manager/volunteers/unverify/${email}`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            toast.success("Unverify Done");
            console.log("Non verified volunteer:", email);
        } catch (error) {
            console.error("Error unverifying volunteer:", error);
            toast.error("Unverify failed");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Page Heading */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-foreground">Manager Page</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Volunteer Verification Dashboard
                </p>
            </div>

            {/* Volunteer Cards Grid */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto"
                style={{ maxHeight: "80vh" }}
            >
                {volunteers.map((volunteer, index) => {
                    // Conditional display for volunteeringTypes
                    const volunteerTypesDisplay = volunteer.volunteeringTypes
                        ? volunteer.volunteeringTypes.length > 1
                            ? volunteer.volunteeringTypes.join(", ")
                            : volunteer.volunteeringTypes[0]
                        : "";

                    // Conditional display for skills
                    const volunteerSkillsDisplay = volunteer.skills
                        ? volunteer.skills.length > 1
                            ? volunteer.skills.join(", ")
                            : volunteer.skills[0]
                        : "";

                    return (
                        <div
                            key={`${volunteer.email}-${index}`}
                            className="bg-card dark:bg-zinc-900 p-4 rounded-lg shadow border border-border"
                        >
                            <h2 className="text-xl font-semibold text-foreground">
                                {volunteer.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">{volunteer.email}</p>

                            <div className="mt-2">
                                <p className="font-medium text-foreground">Volunteer Types:</p>
                                <p className="text-sm text-muted-foreground">
                                    {volunteerTypesDisplay}
                                </p>
                            </div>

                            <div className="mt-2">
                                <p className="font-medium text-foreground">Skills:</p>
                                <p className="text-sm text-muted-foreground">
                                    {volunteerSkillsDisplay}
                                </p>
                            </div>

                            <div className="mt-2">
                                <p className="font-medium text-foreground">About:</p>
                                <p className="text-sm text-muted-foreground">{volunteer.about}</p>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <Button variant="outline" onClick={() => handleVerify(volunteer.email)}>
                                    Verify
                                </Button>
                                <Button variant="destructive" onClick={() => handleNonVerify(volunteer.email)}>
                                    Non Verify
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
