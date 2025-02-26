"use client";
import React, { useEffect, useState } from "react";
import { withAuth } from "@/app/_components/withAuth";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// UI components
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
                <div className="relative inline-block">
                    <TextRoll
                        className="text-3xl font-bold text-primary"
                        variants={{
                            enter: { initial: { rotateX: 0, filter: "blur(0px)" }, animate: { rotateX: 90, filter: "blur(2px)" } },
                            exit: { initial: { rotateX: 90, filter: "blur(2px)" }, animate: { rotateX: 0, filter: "blur(0px)" } },
                        }}
                    >
                        Help Requests
                    </TextRoll>
                    <TextShimmer
                        duration={1.5}
                        spread={3}
                        className="
              absolute inset-0 text-3xl font-bold 
              [--base-color:theme(colors.gray.800)] 
              [--base-gradient-color:theme(colors.indigo.500)] 
              dark:[--base-color:theme(colors.gray.100)] 
              dark:[--base-gradient-color:theme(colors.indigo.400)]
            "
                    >
                        Help Requests
                    </TextShimmer>
                </div>
                <TextEffect per="word" as="p" preset="slide" className="text-muted-foreground mt-2">
                    Manage and track your help requests in real time.
                </TextEffect>
            </div>

            {helpRequests.length === 0 ? (
                <p className="text-center text-muted-foreground">No help requests found.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {helpRequests.map((request) => (
                        <MorphingDialog
                            key={request.id}
                            transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
                        >
                            {/* Trigger Card with Tilt Animation */}
                            <Tilt rotationFactor={8} isRevese>
                                <MorphingDialogTrigger
                                    style={{ borderRadius: "8px" }}
                                    className="flex flex-col max-w-[300px] overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 shadow-md transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                                >
                                    <div className="p-6 space-y-4">
                                        <h2 className="text-xl font-semibold mb-2">{request.name}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">Phone:</span> {request.phone}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">Area:</span> {request.area}
                                        </p>
                                    </div>
                                </MorphingDialogTrigger>
                            </Tilt>

                            {/* Detailed Dialog Content */}
                            <MorphingDialogContainer>
                                <MorphingDialogContent
                                    style={{ borderRadius: "24px" }}
                                    className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[500px]"
                                >
                                    <Card className="max-w-xl mx-auto my-10 shadow-xl border border-border rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-105">
                                        {/* Gradient Header with important details */}
                                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4">
                                            <h2 className="text-2xl font-bold">{request.name}</h2>
                                            <p className="text-sm opacity-90">Request ID: {request.id}</p>
                                        </div>
                                        <CardContent className="p-6 bg-card space-y-2">
                                            <p>
                                                <span className="font-medium">Email:</span>{" "}
                                                {request.email || "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-medium">Phone:</span> {request.phone}
                                            </p>
                                            <p>
                                                <span className="font-medium">Area:</span> {request.area}
                                            </p>
                                            <p>
                                                <span className="font-medium">Bio:</span>{" "}
                                                {request.bio || "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-medium">Profile Picture:</span>{" "}
                                                {request.profilePicture ? (
                                                    <img
                                                        src={request.profilePicture}
                                                        alt={request.name}
                                                        className="h-10 w-10 object-cover inline-block"
                                                    />
                                                ) : (
                                                    "N/A"
                                                )}
                                            </p>
                                            <p>
                                                <span className="font-medium">Roles:</span>{" "}
                                                {request.roles ? request.roles.join(", ") : "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-medium">Form Data:</span>{" "}
                                                {request.formDto && request.formDto.length > 0
                                                    ? JSON.stringify(request.formDto)
                                                    : "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-medium">Status:</span> {request.status}
                                            </p>
                                            <p>
                                                <span className="font-medium">Resolved:</span>{" "}
                                                {request.resolved ? "Yes" : "No"}
                                            </p>
                                            <Separator className="my-4" />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleStatus(request.id)}
                                                className={`w-full ${request.resolved
                                                        ? "text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                                                        : "text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                                    }`}
                                            >
                                                {request.resolved ? "Mark as Pending" : "Mark as Resolved"}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                    <MorphingDialogClose className="text-zinc-50" />
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
