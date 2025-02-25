import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card"; // Adjust the import path as needed
import {
    MorphingDialog,
    MorphingDialogTrigger,
    MorphingDialogContent,
    MorphingDialogClose,
    MorphingDialogContainer,
} from "@/components/core/morphing-dialog";
import { HospitalData } from "./page";
import { Tilt } from "@/components/core/tilt";
import { TextRoll } from "@/components/core/text-roll";
import { TextEffect } from "@/components/core/text-effect";
import { TextShimmer } from "@/components/core/text-shimmer";

interface HospitalCardsGridProps {
    hospitalDataList: HospitalData[];
}

const HospitalCardsGrid: React.FC<HospitalCardsGridProps> = ({ hospitalDataList }) => {
    return (
        <div className="p-6">
            {/* Page Title */}

            <div className="text-center mb-8">
                {/* Container for combined heading animations */}
                <div className="relative inline-block">
                    {/* TextRoll Animation */}
                    <TextRoll
                        className="text-3xl font-bold text-primary"
                        variants={{
                            enter: {
                                initial: { rotateX: 0, filter: "blur(0px)" },
                                animate: { rotateX: 90, filter: "blur(2px)" },
                            },
                            exit: {
                                initial: { rotateX: 90, filter: "blur(2px)" },
                                animate: { rotateX: 0, filter: "blur(0px)" },
                            },
                        }}
                    >
                        Hospital Bed Availability
                    </TextRoll>

                    {/* TextShimmer Animation overlaid on top */}
                    <TextShimmer
                        duration={1.5} // Smoother animation
                        spread={3} // Wider gradient spread
                        className={`
            absolute inset-0 text-3xl font-bold 
            [--base-color:theme(colors.gray.800)] 
            [--base-gradient-color:theme(colors.indigo.500)] 
            dark:[--base-color:theme(colors.gray.100)] 
            dark:[--base-gradient-color:theme(colors.indigo.400)]
          `}
                    >
                        Hospital Bed Availability
                    </TextShimmer>
                </div>

                {/* Subheading remains unchanged */}
                <TextEffect
                    per="word"
                    as="p"
                    preset="slide"
                    className="text-muted-foreground mt-2"
                >
                    Check real-time availability of critical and non-critical hospital beds.
                </TextEffect>
            </div>


            {/* Hospital Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitalDataList.map((hospitalData, index) => (
                    <MorphingDialog
                        key={hospitalData["Hospital ID"] || index}
                        transition={{
                            type: 'spring',
                            bounce: 0.05,
                            duration: 0.25,
                        }}
                    >
                        {/* Trigger Card */}
                        <Tilt rotationFactor={8} isRevese>
                            <MorphingDialogTrigger
                                style={{
                                    borderRadius: '8px',
                                }}
                                className="flex flex-col max-w-[300px] overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 shadow-md transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                            >
                                <div className="p-6 space-y-4">
                                    {/* Hospital Name and ID */}
                                    <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 line-clamp-1">
                                        {hospitalData["Hospital Name"]}
                                    </h3>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-400">
                                        <span className="font-medium">ID:</span> {hospitalData["Hospital ID"]}
                                    </p>
                                    <div className="border-t pt-4">
                                        {/* Contact Information */}
                                        <h4 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                                            Contact Information
                                        </h4>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-400">
                                            <span className="font-medium">Contact Person:</span> {hospitalData["Cotact Person Name"]}
                                        </p>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-400">
                                            <span className="font-medium">Mobile:</span> {hospitalData["Contact Person Mobile"]}
                                        </p>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-400">
                                            <span className="font-medium">Phone:</span> {hospitalData["Hospital Phone no."]}
                                        </p>
                                    </div>
                                    <div className="border-t pt-4">
                                        {/* Free Beds Information */}
                                        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                                            <span className="font-medium">Free Beds:</span> {hospitalData["Total Free Bed"]}
                                        </p>
                                        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                                            <span className="font-medium">Free Critical (w/ ventilator):</span> {hospitalData["Total Free Critical Bed (with ventilator)"]}
                                        </p>
                                    </div>
                                </div>
                            </MorphingDialogTrigger>
                        </Tilt>

                        {/* Detailed Content */}
                        <MorphingDialogContainer>
                            <MorphingDialogContent
                                style={{
                                    borderRadius: '24px',
                                }}
                                className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[500px]"
                            >
                                <Card className="max-w-xl mx-auto my-10 shadow-xl border border-border rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-105">
                                    <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4">
                                        <CardTitle className="text-2xl font-bold">
                                            {hospitalData["Hospital Name"]}
                                        </CardTitle>
                                        <CardDescription className="text-sm opacity-90 text-black">
                                            Hospital ID: {hospitalData["Hospital ID"]}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 bg-card">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                                                <p>
                                                    <span className="font-medium">Contact Person:</span>{" "}
                                                    {hospitalData["Cotact Person Name"]}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Mobile:</span>{" "}
                                                    {hospitalData["Contact Person Mobile"]}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Phone:</span>{" "}
                                                    {hospitalData["Hospital Phone no."]}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Liaison Officer:</span>{" "}
                                                    {hospitalData["Liason Officer Number"]}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Bed Availability</h3>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>
                                                        <span className="font-medium">Total Free Beds:</span>{" "}
                                                        {hospitalData["Total Free Bed"]}
                                                    </li>
                                                    <li>
                                                        <span className="font-medium">
                                                            Total Free Critical (w/ ventilator):
                                                        </span>{" "}
                                                        {hospitalData["Total Free Critical Bed (with ventilator)"]}
                                                    </li>
                                                    <li>
                                                        <span className="font-medium">
                                                            Total Free Critical (w/o ventilator):
                                                        </span>{" "}
                                                        {hospitalData["Total Free Critical Bed (without ventilator)"]}
                                                    </li>
                                                    <li>
                                                        <span className="font-medium">
                                                            Total Free Non-Critical Beds:
                                                        </span>{" "}
                                                        {hospitalData["Total Free Non-Critical Bed"]}
                                                    </li>
                                                    <li>
                                                        <span className="font-medium">
                                                            Available Critical (w/ ventilator):
                                                        </span>{" "}
                                                        {hospitalData["Available Free Critical Bed (with ventilator)"]}
                                                    </li>
                                                    <li>
                                                        <span className="font-medium">
                                                            Available Critical (w/o ventilator):
                                                        </span>{" "}
                                                        {hospitalData["Available Free Critical Bed (without ventilator)"]}
                                                    </li>
                                                    <li>
                                                        <span className="font-medium">Available Non-Critical:</span>{" "}
                                                        {hospitalData["Available Free Non-Critical Bed"]}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mt-6 border-t pt-3">
                                            <p className="text-sm text-muted-foreground">
                                                Last Update: {hospitalData["Last Update Date"]}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <MorphingDialogClose className="text-zinc-50" />
                            </MorphingDialogContent>
                        </MorphingDialogContainer>
                    </MorphingDialog>
                ))}
            </div>
        </div>
    );
};

export default HospitalCardsGrid;
