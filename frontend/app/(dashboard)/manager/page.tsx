"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Volunteer data type - note the email field is now 'userEmail'
type VolunteerProfileDto = {
  userEmail: string;
  name: string;
  phone: string;
  area: string;
  bio: string;
  profilePicture: string; // Base64 string
  roles: string[];
  helpRequests: any[];
  volunteeringTypes?: string[];
  skills?: string[];
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
        // Fetch volunteers
        const volResponse = await axios.get("http://localhost:8081/api/manager/volunteers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const volunteersData = Array.isArray(volResponse.data)
          ? volResponse.data
          : volResponse.data.volunteers || [];
        setVolunteers(volunteersData);

        // Fetch hospitals
        const hospResponse = await axios.get("http://localhost:8081/api/manager/hospitals", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        <h1 className="text-4xl font-bold text-foreground">Manager Page</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Verification Dashboard for Volunteers and Hospitals
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
            </div>
          ))}
        </div>
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
              <p className="text-sm text-muted-foreground">{hospital.officialEmail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
