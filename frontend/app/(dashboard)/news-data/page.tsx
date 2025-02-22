"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/core/text-effect";
import { TextRoll } from "@/components/core/text-roll";
import { TextShimmer } from "@/components/core/text-shimmer";
import { AnimatedGroup } from '@/components/core/animated-group';
import { Tilt } from "@/components/core/tilt";
import { Spotlighter } from "@/components/core/spotlighter";
import { motion } from "framer-motion";
import { BorderTrail } from "@/components/core/border-trail";
import { GlowEffect } from "@/components/core/glow-effect";
import { Carousel, CarouselContent, CarouselIndicator, CarouselItem, CarouselNavigation } from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";







const NewsData = () => {
    const [activePage, setActivePage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8081/api/news/pandemic?page=${activePage}`);
                const data = await response.json();
                if (data.length === 16) {
                    setNewsData(data);
                } else {
                    setNewsData([]);
                }
            } catch (error) {
                console.error("Error fetching news data:", error);
                setNewsData([]);
            }
            setLoading(false);
        };
        fetchNews();
    }, [activePage]);

    const handlePageChange = (page: number) => {
        if (newsData.length === 16 || page === 1) {
            setActivePage(page);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 relative pb-32">
            {/* Heading Section */}
            <div className="text-center mb-8">
                <div className="relative inline-block">
                    <TextRoll className="text-3xl font-bold text-primary">Live News Updates</TextRoll>
                    <TextShimmer className="absolute inset-0 text-3xl font-bold" duration={1.5} spread={3}>
                        Live News Updates
                    </TextShimmer>
                </div>
                <TextEffect per="word" as="p" preset="slide" className="text-muted-foreground mt-2">
                    Stay informed with the latest crisis-related news and real-time updates.
                </TextEffect>
            </div>

            {/* Loader while fetching */}
            {loading && (
                <div className="flex min-h-screen items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            )}

            {/* News Cards */}
            {!loading && newsData.length > 0 && (
                <AnimatedGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {newsData.map((news, index) => (
                        <Tilt key={index} rotationFactor={8} isRevese>
                            <div className="relative overflow-hidden rounded-md border border-zinc-950/10 bg-white text-zinc-700 dark:border-zinc-50/20 dark:bg-zinc-950 dark:text-zinc-300">
                                <BorderTrail className='bg-linear-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700' size={120} />
                                <Card className="shadow-md">
                                    <img src={news.urlToImage} alt={news.title} className="w-full h-48 object-cover" />
                                    <CardHeader>
                                        <CardTitle>{news.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{news.description}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{news.content}</p>
                                        <a href={news.url} target="_blank" rel="noopener noreferrer">
                                            <div className="relative inline-block mt-4">
                                                <GlowEffect colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]} mode="colorShift" blur="soft" duration={3} scale={1} />
                                                <Button variant="default" className="relative">Read More</Button>
                                            </div>
                                        </a>
                                    </CardContent>
                                </Card>
                            </div>
                        </Tilt>
                    ))}
                </AnimatedGroup>
            )}

            {/* Pagination Carousel */}
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-md">
                <Carousel>
                    <CarouselContent>
                        {[...Array(12).keys()].map((num) => (
                            <CarouselItem key={num} className='p-2 cursor-pointer'>
                                <div
                                    className={`flex w-8 h-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium ${activePage === num + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                    onClick={() => handlePageChange(num + 1)}
                                >
                                    {num + 1}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselNavigation alwaysShow />
                    <CarouselIndicator />
                </Carousel>
            </div>
        </div>
    );
};

export default NewsData;
