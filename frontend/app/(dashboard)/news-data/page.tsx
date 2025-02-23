"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TextEffect } from "@/components/core/text-effect";
import { TextRoll } from "@/components/core/text-roll";
import { TextShimmer } from "@/components/core/text-shimmer";
import { BorderTrail } from "@/components/core/border-trail";
import { AnimatedGroup } from "@/components/core/animated-group";
import { GlowEffect } from "@/components/core/glow-effect";
import { Tilt } from "@/components/core/tilt";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const NewsData = () => {
    const [activePage, setActivePage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const cardsPerPage = 12; // Fixed number of cards per page

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8081/api/news/pandemic");
                setNewsData(response.data || []);
            } catch (error) {
                console.error("Error fetching news data:", error);
                setNewsData([]);
            }
            setLoading(false);
        };
        fetchNews();
    }, []);

    // Total number of pages dynamically
    const totalPages = Math.ceil(newsData.length / cardsPerPage);

    // Current page ka data slice karega
    const paginatedNews = newsData.slice((activePage - 1) * cardsPerPage, activePage * cardsPerPage);

    // Agar last page pe 12 se kam cards ho, next page remove ho jaye
    const isLastPage = activePage === totalPages;
    const canShowNextPage = paginatedNews.length === cardsPerPage;

    // Scroll to Top Function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Function to change page
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setActivePage(page);
            scrollToTop(); // User ko top par le jana jab page change ho
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
            {!loading && paginatedNews.length > 0 && (
                <AnimatedGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {paginatedNews.map((news, index) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-zinc-900/90 text-white px-4 py-2 rounded-lg shadow-lg border border-zinc-700">
                    {/* Previous Button */}
                    {activePage > 1 && (
                        <Button
                            onClick={() => handlePageChange(activePage - 1)}
                            className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-700 hover:bg-zinc-600 transition duration-300"
                        >
                            {"<"}
                        </Button>
                    )}

                    {/* Carousel Content */}
                    <Carousel>
                        <CarouselContent className="flex items-center gap-2">
                            {/* Left Page */}
                            {activePage > 1 && (
                                <CarouselItem className="p-1 cursor-pointer">
                                    <div
                                        className="flex w-9 h-9 items-center justify-center rounded-md bg-zinc-800 hover:bg-zinc-700 transition duration-300 text-white font-semibold border border-zinc-600"
                                        onClick={() => handlePageChange(activePage - 1)}
                                    >
                                        {activePage - 1}
                                    </div>
                                </CarouselItem>
                            )}

                            {/* Active Page */}
                            <CarouselItem className="p-1 cursor-pointer">
                                <div className="flex w-10 h-10 items-center justify-center rounded-md bg-white text-zinc-900 font-bold border border-zinc-500 shadow-lg">
                                    {activePage}
                                </div>
                            </CarouselItem>

                            {/* Right Page */}
                            {canShowNextPage && (
                                <CarouselItem className="p-1 cursor-pointer">
                                    <div
                                        className="flex w-9 h-9 items-center justify-center rounded-md bg-zinc-800 hover:bg-zinc-700 transition duration-300 text-white font-semibold border border-zinc-600"
                                        onClick={() => handlePageChange(activePage + 1)}
                                    >
                                        {activePage + 1}
                                    </div>
                                </CarouselItem>
                            )}
                        </CarouselContent>
                    </Carousel>

                    {/* Next Button */}
                    {canShowNextPage && (
                        <Button
                            onClick={() => handlePageChange(activePage + 1)}
                            className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-700 hover:bg-zinc-600 transition duration-300"
                        >
                            {">"}
                        </Button>
                    )}
                </div>
            )}

        </div>
    );
};

export default NewsData;
