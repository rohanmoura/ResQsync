"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Updated Hospital data type
type HospitalInfoRoleAccessDto = {
    registrationNumber: string;
    hospitalName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    officialEmail: string;
    phone: string;
    website: string;
    userEmail: string; // from HospitalInfo.user.email
    verified: boolean;
};

export default function HospitalManagerPage() {
    const [hospitals, setHospitals] = useState<HospitalInfoRoleAccessDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHospitalData() {
            try {
                const token = localStorage.getItem("jwtToken");
                const hospResponse = await axios.get("http://localhost:8081/api/manager/hospitals", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const hospitalsData = Array.isArray(hospResponse.data)
                    ? hospResponse.data
                    : hospResponse.data.hospitals || [];
                setHospitals(hospitalsData);
            } catch (error) {
                console.error("Error fetching hospital data:", error);
                toast.error("Failed to load hospital data.");
            } finally {
                setLoading(false);
            }
        }
        fetchHospitalData();
    }, []);

    const handleHospitalVerify = async (officialEmail: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/hospitals/verify?email=${encodeURIComponent(officialEmail)}`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Hospital Verified!");
        } catch (error) {
            console.error("Error verifying hospital:", error);
            toast.error("Hospital verification failed");
        }
    };

    const handleHospitalNonVerify = async (officialEmail: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/hospitals/unverify?email=${encodeURIComponent(officialEmail)}`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Hospital Unverified!");
        } catch (error) {
            console.error("Error unverifying hospital:", error);
            toast.error("Hospital unverification failed");
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
                <h1 className="text-4xl font-bold text-foreground">Hospital Manager Page</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Verification Dashboard for Hospitals
                </p>
            </div>

            {/* Hospital Cards Grid */}
            <div className="flex flex-col items-center w-full">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Hospitals</h2>
                <div className="grid grid-cols-auto-fit min-[250px] max-[400px] gap-8 justify-center w-full">
                    {hospitals.map((hospital, index) => (
                        <div
                            key={`${hospital.officialEmail}-${index}`}
                            className="bg-card dark:bg-zinc-900 p-4 rounded-lg shadow border border-border"
                        >
                            <h3 className="text-xl font-semibold text-foreground">{hospital.hospitalName}</h3>
                            <p className="text-sm text-muted-foreground">Email: {hospital.officialEmail}</p>
                            <p className="text-sm text-muted-foreground">
                                Address: {hospital.address}, {hospital.city}, {hospital.state}, {hospital.zipCode}
                            </p>
                            <p className="text-sm text-muted-foreground">Phone: {hospital.phone}</p>
                            <p className="text-sm text-muted-foreground">Website: {hospital.website}</p>
                            <div className="mt-4 flex justify-between">
                                <Button variant="outline" onClick={() => handleHospitalVerify(hospital.officialEmail)}>
                                    Verify
                                </Button>
                                <Button variant="destructive" onClick={() => handleHospitalNonVerify(hospital.officialEmail)}>
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
