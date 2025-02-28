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
import { withAuth } from "@/app/_components/withAuth";

const ReportsPage = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/signin");
            return;
        }

        axios
            .get("http://localhost:8081/api/reports", {
                headers: {
                    // "Content-Type" header is not required for GET requests.
                    "Authorization": `Bearer ${token}`,
                },
            })
            .then((response) => {
                // Ensure that reportsData is an array.
                const reportsData = Array.isArray(response.data)
                    ? response.data
                    : response.data.reports || [];
                setReports(reportsData);
            })
            .catch((error) => {
                console.error("Error fetching reports:", error);
            })
            .finally(() => setLoading(false));
    }, [router]);

    // Function for downloading a report.
    const downloadReport = async (report: any) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            window.location.href = "/signin";
            return;
        }
        try {
            const response = await axios.get(
                `http://localhost:8081/api/reports/download/${report.id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    responseType: "blob", // Ensure we get binary data
                }
            );

            // Extract filename from the Content-Disposition header if available.
            const disposition = response.headers["content-disposition"];
            let filename = "downloaded_report";
            if (disposition && disposition.indexOf("filename=") !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches && matches[1]) {
                    filename = matches[1].replace(/['"]/g, "");
                }
            }

            // Create a Blob from the response data.
            const blob = new Blob([response.data], {
                type: response.headers["content-type"] || "application/octet-stream",
            });
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor element and trigger the download.
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            // Clean up the object URL.
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading report:", error);
            // Optionally, display an error message to the user.
        }
    };

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
                        // The "Open" button uses the existing reportDataUrl.
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
                                    <Button variant="outline" size="sm" onClick={() => downloadReport(report)}>
                                        Download
                                    </Button>
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

export default withAuth(ReportsPage);
