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
    volunteeringTypes: string[];
    skills: string[];
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
                        "Content-Type": "multipart/form-data",
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

    const handleVerify = (email: string) => {
        // Replace this with an actual API call as needed.
        toast.success(`Volunteer ${email} Verified!`);
        console.log("Verified volunteer:", email);
    };

    const handleNonVerify = (email: string) => {
        // Replace this with an actual API call as needed.
        toast.success(`Volunteer ${email} marked as Non Verified!`);
        console.log("Non verified volunteer:", email);
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
                {volunteers.map((volunteer) => (
                    <div
                        key={volunteer.email}
                        className="bg-card dark:bg-zinc-900 p-4 rounded-lg shadow border border-border"
                    >
                        <h2 className="text-xl font-semibold text-foreground">
                            {volunteer.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">{volunteer.email}</p>

                        <div className="mt-2">
                            <p className="font-medium text-foreground">Volunteer Types:</p>
                            <p className="text-sm text-muted-foreground">
                                {volunteer.volunteeringTypes.join(", ")}
                            </p>
                        </div>

                        <div className="mt-2">
                            <p className="font-medium text-foreground">Skills:</p>
                            <p className="text-sm text-muted-foreground">
                                {volunteer.skills.join(", ")}
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
                ))}
            </div>
        </div>
    );
}
