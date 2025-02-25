"use client";
import React, { useEffect, useState } from "react";
import { withAuth } from "@/app/_components/withAuth";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type HelpRequest = {
    id: number;
    name: string;
    phone: string;
    area: string;
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
            <h1 className="text-4xl font-bold mb-6 text-center">Help Requests</h1>
            {helpRequests.length === 0 ? (
                <p className="text-center text-muted-foreground">
                    No help requests found.
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {helpRequests.map((request) => (
                        <Card
                            key={request.id}
                            className="p-6 flex flex-col justify-between hover:shadow-xl transition-shadow"
                        >
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{request.name}</h2>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <span className="font-medium">Phone:</span> {request.phone}
                                </p>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <span className="font-medium">Area:</span> {request.area}
                                </p>
                            </div>
                            <Separator className="my-2" />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleStatus(request.id)}
                                className={`w-full ${request.resolved
                                        ? "text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                                        : "text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                    }`}
                            >
                                {request.resolved ? "Resolved" : "Pending"}
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default withAuth(HelpRequestPage);
