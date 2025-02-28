"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Updated Volunteer data type
type VolunteerDtoRoleAccess = {
    id: number;
    userEmail: string; // from Volunteer.user.email
    name: string;
    phone: string;
    area: string;
    about: string;
    volunteeringTypes: string[]; // assuming list of strings for display
    skills: string[];
    verified: boolean;
};

export default function ManagerPage() {
    const [volunteers, setVolunteers] = useState<VolunteerDtoRoleAccess[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("jwtToken");
                const volResponse = await axios.get("http://localhost:8081/api/manager/volunteers", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const volunteersData = Array.isArray(volResponse.data)
                    ? volResponse.data
                    : volResponse.data.volunteers || [];
                setVolunteers(volunteersData);
            } catch (error) {
                console.error("Error fetching volunteer data:", error);
                toast.error("Failed to load volunteer data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleVolunteerVerify = async (userEmail: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/volunteers/verify?email=${encodeURIComponent(userEmail)}`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Volunteer Verified!");
        } catch (error) {
            console.error("Error verifying volunteer:", error);
            toast.error("Volunteer verification failed");
        }
    };

    const handleVolunteerNonVerify = async (userEmail: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/volunteers/unverify?email=${encodeURIComponent(userEmail)}`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Volunteer Unverified!");
        } catch (error) {
            console.error("Error unverifying volunteer:", error);
            toast.error("Volunteer unverification failed");
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
        <div className="p-6 space-y-10 flex flex-col items-center">
            {/* Page Heading */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground">Volunteer Manager Page</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Verification Dashboard for Volunteers
                </p>
            </div>

            {/* Volunteer Cards Grid */}
            <div className="flex flex-col items-center w-full">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Volunteers</h2>
                <div className="grid grid-cols-auto-fit min-[250px] max-[400px] gap-8 justify-center w-full">
                    {volunteers.map((volunteer, index) => (
                        <div
                            key={`${volunteer.userEmail}-${index}`}
                            className="bg-card dark:bg-zinc-900 p-4 rounded-lg shadow border border-border"
                        >
                            <h3 className="text-xl font-semibold text-foreground">{volunteer.name}</h3>
                            <p className="text-sm text-muted-foreground">{volunteer.userEmail}</p>
                            <p className="text-sm text-muted-foreground">Phone: {volunteer.phone}</p>
                            <p className="text-sm text-muted-foreground">Area: {volunteer.area}</p>
                            <p className="text-sm text-muted-foreground">About: {volunteer.about}</p>
                            <p className="text-sm text-muted-foreground">
                                Volunteering Types: {volunteer.volunteeringTypes.join(", ")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Skills: {volunteer.skills.join(", ")}
                            </p>
                            <div className="mt-4 flex justify-between">
                                <Button variant="outline" onClick={() => handleVolunteerVerify(volunteer.userEmail)}>
                                    Verify
                                </Button>
                                <Button variant="destructive" onClick={() => handleVolunteerNonVerify(volunteer.userEmail)}>
                                    Non Verify
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
