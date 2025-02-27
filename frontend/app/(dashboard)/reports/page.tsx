"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Shadcn UI Card & Button components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import TextShimmer from your motion-pretives component library
import { TextShimmer } from "@/components/core/text-shimmer";

const ReportsPage = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            // Redirect unauthenticated users to the signin page.
            router.push("/signin");
            return;
        }

        axios
            .get("http://localhost:8081/api/reports", {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            })
            .then((response) => {
                setReports(response.data);
            })
            .catch((error) => {
                console.error("Error fetching reports:", error);
            })
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Centered heading using TextShimmer */}
            <div className="text-center mb-8">
                <TextShimmer duration={1.5} spread={3} className="text-3xl font-bold text-primary inline-block">
                    Reports
                </TextShimmer>
            </div>
            {reports.length === 0 ? (
                <p className="text-muted-foreground text-center">No reports found.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => {
                        // Encode the URL so that spaces and special characters are handled
                        const fileUrl = encodeURI(report.reportDataUrl);
                        return (
                            <Card key={report.id} className="border border-border shadow-md rounded-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">{report.fileName}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Report ID: {report.id}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <a href={fileUrl} download={report.fileName} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">
                                            Download
                                        </Button>
                                    </a>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(fileUrl, "_blank", "noopener,noreferrer")}
                                    >
                                        Open
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReportsPage;
