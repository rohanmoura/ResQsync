"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HospitalCardsGrid from './HospitalCardsGrid';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Define the hospital data interface
export interface HospitalData {
    "Total Free Critical Bed (with ventilator)": string;
    "Total Free Critical Bed (without ventilator)": string;
    "Cotact Person Name": string;
    "Last Update Date": string;
    "Hospital ID": string;
    "Liason Officer Number": string;
    "Hospital Name": string;
    "Available Free Critical Bed (without ventilator)": string;
    "Available Free Critical Bed (with ventilator)": string;
    "Available Free Non-Critical Bed": string;
    "Hospital Phone no.": string;
    "Contact Person Mobile": string;
    "Total Free Bed": string;
    "Total Free Non-Critical Bed": string;
}

const HospitalsPage: React.FC = () => {
    const [hospitalDataList, setHospitalDataList] = useState<HospitalData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the data from your API endpoint when the component mounts
        axios.get<HospitalData[]>('http://localhost:8081/api/hospitals/data')
            .then(response => {
                setHospitalDataList(response.data);
            })
            .catch(err => {
                setError(err.message || 'Error fetching data');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    if (error)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Card className="border border-destructive/50 bg-destructive/10 text-destructive">
                    <CardContent className="p-4 flex items-center gap-2">
                        <AlertCircle className="h-6 w-6" />
                        <span>{error}</span>
                    </CardContent>
                </Card>
            </div>
        );

    // Pass the fetched data to your grid component
    return <HospitalCardsGrid hospitalDataList={hospitalDataList} />;
};

export default HospitalsPage;
