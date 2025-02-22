"use client";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BorderTrail } from "@/components/core/border-trail";
import { TextRoll } from "@/components/core/text-roll";
import { GlowEffect } from "@/components/core/glow-effect";
import { ArrowRight } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            {/* Card Wrapper with BorderTrail */}
            <div className="relative h-[500px] w-full max-w-md overflow-hidden rounded-md border border-zinc-950/10 bg-white text-zinc-700 outline-hidden dark:border-zinc-50/20 dark:bg-zinc-950 dark:text-zinc-300">
                <Card className="h-full w-full rounded-md bg-transparent p-6 shadow-none">
                    <CardHeader className="text-center">
                        {/* TextRoll Animation for Card Title */}
                        <TextRoll
                            className="text-2xl font-semibold text-black dark:text-white"
                            variants={{
                                enter: {
                                    initial: { rotateX: 0, filter: 'blur(0px)' },
                                    animate: { rotateX: 90, filter: 'blur(2px)' },
                                },
                                exit: {
                                    initial: { rotateX: 90, filter: 'blur(2px)' },
                                    animate: { rotateX: 0, filter: 'blur(0px)' },
                                },
                            }}
                            duration={1.5}
                        >
                            Sign Up
                        </TextRoll>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <Label htmlFor="username" className="block text-sm font-medium">
                                    Username
                                </Label>
                                <div className="relative h-[50px] w-full overflow-hidden rounded-md border border-zinc-950/10 bg-white text-zinc-700 outline-hidden dark:border-zinc-50/20 dark:bg-zinc-950 dark:text-zinc-300 mt-1">
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="your username"
                                        required
                                        className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-hidden"
                                    />
                                    <BorderTrail
                                        className="bg-linear-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
                                        size={120}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </Label>
                                <div className="relative h-[50px] w-full overflow-hidden rounded-md border border-zinc-950/10 bg-white text-zinc-700 outline-hidden dark:border-zinc-50/20 dark:bg-zinc-950 dark:text-zinc-300 mt-1">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-hidden"
                                    />
                                    <BorderTrail
                                        className="bg-linear-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
                                        size={120}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative h-[50px] w-full overflow-hidden rounded-md border border-zinc-950/10 bg-white text-zinc-700 outline-hidden dark:border-zinc-50/20 dark:bg-zinc-950 dark:text-zinc-300 mt-1">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-hidden"
                                    />
                                    <BorderTrail
                                        className="bg-linear-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
                                        size={120}
                                    />
                                </div>
                            </div>

                            {/* Button with Glow Effect */}
                            <div className="relative inline-block">
                                <GlowEffect
                                    colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
                                    mode="colorShift"
                                    blur="soft"
                                    duration={3}
                                    scale={1}
                                />
                                <button
                                    type="submit"
                                    className="relative inline-flex items-center gap-1 rounded-md bg-zinc-950 px-3 py-1.5 text-sm font-semibold text-zinc-50 outline outline-1 outline-[#fff2f21f]"
                                >
                                    Sign Up <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                {/* BorderTrail for the Card */}
                <BorderTrail
                    className="bg-linear-to-l from-[#6366F1] via-[#818CF8] to-[#C7D2FE] dark:from-[#A78BFA] dark:via-[#818CF8] dark:to-[#6366F1]"
                    size={120}
                />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/signin" className="font-medium underline hover:text-primary">
                    Sign In
                </Link>
            </p>
        </div>
    );
}
