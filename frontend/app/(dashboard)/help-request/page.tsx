"use client";
import React, { useEffect, useState } from "react";
import { withAuth } from "@/app/_components/withAuth";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// UI components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Animation components
import {
    MorphingDialog,
    MorphingDialogTrigger,
    MorphingDialogContent,
    MorphingDialogClose,
    MorphingDialogContainer,
} from "@/components/core/morphing-dialog";
import { Tilt } from "@/components/core/tilt";
import { TextRoll } from "@/components/core/text-roll";
import { TextShimmer } from "@/components/core/text-shimmer";
import { TextEffect } from "@/components/core/text-effect";

// Expanded type including all fields
type HelpRequest = {
    id: number;
    email: string | null;
    name: string;
    phone: string;
    area: string;
    bio: string | null;
    profilePicture: string | null;
    roles: string[] | null;
    formDto: any[];
    status: string;
    resolved: boolean;
};

type ProfileData = {
    helpRequests: HelpRequest[];
};

const HelpRequestPage = () => {
    const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setLoading(false);
            return;
        }
        axios
            .get("http://localhost:8081/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const data: ProfileData = response.data;
                setHelpRequests(data.helpRequests || []);
            })
            .catch((error) => {
                toast.error("Failed to fetch help requests");
                console.error("Error fetching help requests:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    const toggleStatus = (id: number) => {
        setHelpRequests((prev) =>
            prev.map((req) =>
                req.id === id ? { ...req, resolved: !req.resolved } : req
            )
        );
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Animated Page Heading */}
            <div className="text-center mb-8">
                <TextRoll className="text-3xl font-bold text-primary">Help Requests</TextRoll>
                <TextShimmer duration={1.5} spread={3} className="absolute inset-0 text-3xl font-bold">
                    Help Requests
                </TextShimmer>
                <TextEffect per="word" as="p" preset="slide" className="text-muted-foreground mt-2">
                    Manage and track your help requests in real time.
                </TextEffect>
            </div>

            {helpRequests.length === 0 ? (
                <p className="text-center text-muted-foreground">No help requests found.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {helpRequests.map((request) => (
                        <MorphingDialog key={request.id}>
                            {/* Trigger Card with Important Details */}
                            <Tilt rotationFactor={8} isRevese>
                                <MorphingDialogTrigger
                                    className="flex flex-col max-w-[300px] p-6 space-y-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md transition-transform duration-300 hover:scale-[1.02] cursor-pointer rounded-lg"
                                >
                                    <h2 className="text-xl font-semibold">{request.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium">Help Needed:</span> {request.status}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Status:</span>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div
                                                    className={`h-3 w-3 rounded-full ${request.resolved ? "bg-green-500" : "bg-red-500"}`}
                                                ></div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {request.resolved ? "Resolved" : "Pending"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </MorphingDialogTrigger>
                            </Tilt>

                            {/* Detailed Dialog Content */}
                            <MorphingDialogContainer>
                                <MorphingDialogContent className="relative flex flex-col w-full sm:w-[500px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-6">
                                    <h2 className="text-2xl font-bold mb-4">{request.name}</h2>
                                    <p><span className="font-medium">Email:</span> {request.email || "N/A"}</p>
                                    <p><span className="font-medium">Phone:</span> {request.phone}</p>
                                    <p><span className="font-medium">Area:</span> {request.area}</p>
                                    <p><span className="font-medium">Bio:</span> {request.bio || "N/A"}</p>
                                    <Separator className="my-4" />
                                    <Button variant="outline" onClick={() => toggleStatus(request.id)}>
                                        {request.resolved ? "Mark as Pending" : "Mark as Resolved"}
                                    </Button>
                                    <MorphingDialogClose className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" />
                                </MorphingDialogContent>
                            </MorphingDialogContainer>
                        </MorphingDialog>
                    ))}
                </div>
            )}
        </div>
    );
};

export default withAuth(HelpRequestPage);
