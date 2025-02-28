"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Volunteer data type
type VolunteerProfileDto = {
    email: string;
    name: string;
    phone: string;
    area: string;
    bio: string;
    profilePicture: string; // Base64 string
    roles: string[];
    helpRequests: any[];
    volunteeringTypes?: string[]; // Optional to avoid errors
    skills?: string[];          // Optional for safe-checking
    about: string;
};

// Hospital data type (based on your backend)
type HospitalInfoDto = {
    registrationNumber: string;
    hospitalName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    officialEmail: string;
    phone: string;
    website: string;
    verified: boolean;
};

export default function ManagerPage() {
    const [volunteers, setVolunteers] = useState<VolunteerProfileDto[]>([]);
    const [hospitals, setHospitals] = useState<HospitalInfoDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("jwtToken");
                // First, get the manager's profile to retrieve the email.
                const userResponse = await axios.get("http://localhost:8081/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const managerEmail = userResponse.data.email;

                // Fetch volunteers using the manager's email as query parameter.
                const volResponse = await axios.get(
                    `http://localhost:8081/api/manager/volunteers?email=${encodeURIComponent(managerEmail)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const volunteersData = Array.isArray(volResponse.data)
                    ? volResponse.data
                    : volResponse.data.volunteers || [];
                setVolunteers(volunteersData);

                // Fetch hospitals using the manager's email as query parameter.
                const hospResponse = await axios.get(
                    `http://localhost:8081/api/manager/hospitals?email=${encodeURIComponent(managerEmail)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const hospitalsData = Array.isArray(hospResponse.data)
                    ? hospResponse.data
                    : hospResponse.data.hospitals || [];
                setHospitals(hospitalsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load manager data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Volunteer Verification Functions
    const handleVolunteerVerify = async (email: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/volunteers/verify?email=${encodeURIComponent(email)}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Volunteer Verified!");
            console.log("Verified volunteer:", email);
        } catch (error) {
            console.error("Error verifying volunteer:", error);
            toast.error("Volunteer verification failed");
        }
    };

    const handleVolunteerNonVerify = async (email: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/volunteers/unverify?email=${encodeURIComponent(email)}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Volunteer Unverified!");
            console.log("Unverified volunteer:", email);
        } catch (error) {
            console.error("Error unverifying volunteer:", error);
            toast.error("Volunteer unverification failed");
        }
    };

    // Hospital Verification Functions
    const handleHospitalVerify = async (officialEmail: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/hospitals/verify?email=${encodeURIComponent(officialEmail)}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Hospital Verified!");
            console.log("Verified hospital:", officialEmail);
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
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Hospital Unverified!");
            console.log("Unverified hospital:", officialEmail);
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
        <div className="p-6 space-y-10">
            {/* Page Heading */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground">Manager Page</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Verification Dashboard for Volunteers and Hospitals
                </p>
            </div>

            {/* Volunteer Cards Grid */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Volunteers</h2>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto"
                    style={{ maxHeight: "60vh" }}
                >
                    {volunteers.map((volunteer, index) => {
                        const volunteerTypesDisplay = volunteer.volunteeringTypes
                            ? volunteer.volunteeringTypes.length > 1
                                ? volunteer.volunteeringTypes.join(", ")
                                : volunteer.volunteeringTypes[0]
                            : "";
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
                                <h3 className="text-xl font-semibold text-foreground">{volunteer.name}</h3>
                                <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                                <div className="mt-2">
                                    <p className="font-medium text-foreground">Volunteer Types:</p>
                                    <p className="text-sm text-muted-foreground">{volunteerTypesDisplay}</p>
                                </div>
                                <div className="mt-2">
                                    <p className="font-medium text-foreground">Skills:</p>
                                    <p className="text-sm text-muted-foreground">{volunteerSkillsDisplay}</p>
                                </div>
                                <div className="mt-2">
                                    <p className="font-medium text-foreground">About:</p>
                                    <p className="text-sm text-muted-foreground">{volunteer.about}</p>
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <Button variant="outline" onClick={() => handleVolunteerVerify(volunteer.email)}>
                                        Verify
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleVolunteerNonVerify(volunteer.email)}>
                                        Non Verify
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hospital Cards Grid */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Hospitals</h2>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto"
                    style={{ maxHeight: "60vh" }}
                >
                    {hospitals.map((hospital, index) => (
                        <div
                            key={`${hospital.officialEmail}-${index}`}
                            className="bg-card dark:bg-zinc-900 p-4 rounded-lg shadow border border-border"
                        >
                            <h3 className="text-xl font-semibold text-foreground">{hospital.hospitalName}</h3>
                            <p className="text-sm text-muted-foreground">{hospital.officialEmail}</p>
                            <div className="mt-2">
                                <p className="font-medium text-foreground">Address:</p>
                                <p className="text-sm text-muted-foreground">
                                    {hospital.address}, {hospital.city}, {hospital.state}, {hospital.zipCode}
                                </p>
                            </div>
                            <div className="mt-2">
                                <p className="font-medium text-foreground">Phone:</p>
                                <p className="text-sm text-muted-foreground">{hospital.phone}</p>
                            </div>
                            <div className="mt-2">
                                <p className="font-medium text-foreground">Website:</p>
                                <p className="text-sm text-muted-foreground">{hospital.website}</p>
                            </div>
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
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Volunteer data type
type VolunteerProfileDto = {
    email: string;
    name: string;
    phone: string;
    area: string;
    bio: string;
    profilePicture: string; // Base64 string
    roles: string[];
    helpRequests: any[];
    volunteeringTypes?: string[]; // Optional to avoid errors
    skills?: string[];          // Optional for safe-checking
    about: string;
};

// Hospital data type (based on your backend)
type HospitalInfoDto = {
    registrationNumber: string;
    hospitalName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    officialEmail: string;
    phone: string;
    website: string;
    verified: boolean;
};

export default function ManagerPage() {
    const [volunteers, setVolunteers] = useState<VolunteerProfileDto[]>([]);
    const [hospitals, setHospitals] = useState<HospitalInfoDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("jwtToken");
                // First, get the manager's profile to retrieve the email.
                const userResponse = await axios.get("http://localhost:8081/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const managerEmail = userResponse.data.email;

                // Fetch volunteers using the manager's email as query parameter.
                const volResponse = await axios.get(
                    `http://localhost:8081/api/manager/volunteers?email=${encodeURIComponent(managerEmail)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const volunteersData = Array.isArray(volResponse.data)
                    ? volResponse.data
                    : volResponse.data.volunteers || [];
                setVolunteers(volunteersData);

                // Fetch hospitals using the manager's email as query parameter.
                const hospResponse = await axios.get(
                    `http://localhost:8081/api/manager/hospitals?email=${encodeURIComponent(managerEmail)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const hospitalsData = Array.isArray(hospResponse.data)
                    ? hospResponse.data
                    : hospResponse.data.hospitals || [];
                setHospitals(hospitalsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load manager data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Volunteer Verification Functions
    const handleVolunteerVerify = async (email: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/volunteers/verify?email=${encodeURIComponent(email)}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Volunteer Verified!");
            console.log("Verified volunteer:", email);
        } catch (error) {
            console.error("Error verifying volunteer:", error);
            toast.error("Volunteer verification failed");
        }
    };

    const handleVolunteerNonVerify = async (email: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/volunteers/unverify?email=${encodeURIComponent(email)}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Volunteer Unverified!");
            console.log("Unverified volunteer:", email);
        } catch (error) {
            console.error("Error unverifying volunteer:", error);
            toast.error("Volunteer unverification failed");
        }
    };

    // Hospital Verification Functions
    const handleHospitalVerify = async (officialEmail: string) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            await axios.post(
                `http://localhost:8081/api/manager/hospitals/verify?email=${encodeURIComponent(officialEmail)}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Hospital Verified!");
            console.log("Verified hospital:", officialEmail);
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
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Hospital Unverified!");
            console.log("Unverified hospital:", officialEmail);
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
        <div className="p-6 space-y-10">
            {/* Page Heading */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground">Manager Page</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Verification Dashboard for Volunteers and Hospitals
                </p>
            </div>

            {/* Volunteer Cards Grid */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Volunteers</h2>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto"
                    style={{ maxHeight: "60vh" }}
                >
                    {volunteers.map((volunteer, index) => {
                        const volunteerTypesDisplay = volunteer.volunteeringTypes
                            ? volunteer.volunteeringTypes.length > 1
                                ? volunteer.volunteeringTypes.join(", ")
                                : volunteer.volunteeringTypes[0]
                            : "";
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
                                <h3 className="text-xl font-semibold text-foreground">{volunteer.name}</h3>
                                <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                                <div className="mt-2">
                                    <p className="font-medium text-foreground">Volunteer Types:</p>
                                    <p className="text-sm text-muted-foreground">{volunteerTypesDisplay}</p>
                                </div>
                                <div className="mt-2">
                                    <p className="font-medium text-foreground">Skills:</p>
                                    <p className="text-sm text-muted-foreground">{volunteerSkillsDisplay}</p>
                                </div>
                                <div className="mt-2">
                                    <p className="font-medium text-foreground">About:</p>
                                    <p className="text-sm text-muted-foreground">{volunteer.about}</p>
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <Button variant="outline" onClick={() => handleVolunteerVerify(volunteer.email)}>
                                        Verify
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleVolunteerNonVerify(volunteer.email)}>
                                        Non Verify
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hospital Cards Grid */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Hospitals</h2>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto"
                    style={{ maxHeight: "60vh" }}
                >
                    {hospitals.map((hospital, index) => (
                        <div
                            key={`${hospital.officialEmail}-${index}`}
                            className="bg-card dark:bg-zinc-900 p-4 rounded-lg shadow border border-border"
                        >
                            <h3 className="text-xl font-semibold text-foreground">{hospital.hospitalName}</h3>
                            <p className="text-sm text-muted-foreground">{hospital.officialEmail}</p>
                            <div className="mt-2">
                                <p className="font-medium text-foreground">Address:</p>
                                <p className="text-sm text-muted-foreground">
                                    {hospital.address}, {hospital.city}, {hospital.state}, {hospital.zipCode}
                                </p>
                            </div>
                            <div className="mt-2">
                                <p className="font-medium text-foreground">Phone:</p>
                                <p className="text-sm text-muted-foreground">{hospital.phone}</p>
                            </div>
                            <div className="mt-2">
                                <p className="font-medium text-foreground">Website:</p>
                                <p className="text-sm text-muted-foreground">{hospital.website}</p>
                            </div>
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
