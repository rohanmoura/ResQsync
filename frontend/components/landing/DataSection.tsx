"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Hospital, Newspaper } from "lucide-react";
import { TextShimmer } from "@/components/core/text-shimmer";
import { InView } from "@/components/core/in-view";
import { TextScramble } from "@/components/core/text-scramble";
import { AnimatedGroup } from "@/components/core/animated-group";

const DataSection = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <section className="relative py-20 bg-transparent overflow-hidden">
            <div className="container mx-auto text-center relative z-10">
                <InView
                    variants={{
                        hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
                        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                    }}
                    viewOptions={{ margin: "0px 0px -200px 0px" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {({ inView }) => (
                        <div>
                            <h2 className="text-4xl font-bold tracking-tight">
                                {isClient && (
                                    <TextShimmer className="inline-block" duration={1}>
                                        Real-Time Data Services
                                    </TextShimmer>
                                )}
                            </h2>
                            <div className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                                {isClient && (
                                    <TextScramble className="inline-block" duration={1.2} characterSet=". ">
                                        Get access to live hospital bed availability and the latest crisis-related news updates.
                                    </TextScramble>
                                )}
                            </div>
                        </div>
                    )}
                </InView>
            </div>

            <div className="container mx-auto mt-10 px-6 lg:px-12 relative z-10">
                <InView
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.05,
                            },
                        },
                    }}
                    viewOptions={{ margin: "0px 0px -200px 0px" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {({ inView }) => (
                        <AnimatedGroup
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            variants={{
                                container: {
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.05,
                                        },
                                    },
                                },
                                item: {
                                    hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                        transition: {
                                            duration: 1.2,
                                            type: "spring",
                                            bounce: 0.3,
                                        },
                                    },
                                },
                            }}
                        >
                            {/* Hospital Data Card */}
                            <InView>
                                {({ inView }) => (
                                    <Card className="p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                                        <CardHeader className="flex items-center gap-4">
                                            <Hospital className="w-12 h-12 text-chart-1" />
                                            <CardTitle className="text-xl font-semibold">Hospital Bed Availability</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">
                                                Stay updated with real-time hospital bed availability data for better crisis management.
                                            </p>
                                            <Button
                                                className="mt-4 w-full bg-chart-1 text-white hover:bg-opacity-90"
                                                onClick={() => router.push("/hospital-data")}
                                            >
                                                View Hospital Data
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </InView>

                            {/* News Data Card */}
                            <InView>
                                {({ inView }) => (
                                    <Card className="p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                                        <CardHeader className="flex items-center gap-4">
                                            <Newspaper className="w-12 h-12 text-chart-4" />
                                            <CardTitle className="text-xl font-semibold">Live News Updates</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">
                                                Stay informed with the latest crisis-related news and real-time updates.
                                            </p>
                                            <Button
                                                className="mt-4 w-full bg-chart-4 text-white hover:bg-opacity-90"
                                                onClick={() => router.push("/news-data")}
                                            >
                                                View News Data
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </InView>
                        </AnimatedGroup>
                    )}
                </InView>
            </div>
        </section>
    );
};

export default DataSection;