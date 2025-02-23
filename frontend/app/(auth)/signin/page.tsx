"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BorderTrail } from "@/components/core/border-trail";
import { TextRoll } from "@/components/core/text-roll";
import { GlowEffect } from "@/components/core/glow-effect";
import { ArrowRight } from "lucide-react";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import { toast } from "sonner";


export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Reset previous error

        try {
            const response = await axios.post("http://localhost:8081/api/auth/login", {
                email,
                password,
            });

            console.log("Full Response: ", response); // Debugging
            const token = response.headers["authorization"];

            if (token && typeof token === "string") {
                let jwt = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

                const decodedToken = jwtDecode(jwt);
                const expirationTime = decodedToken.exp;

                localStorage.setItem("jwtToken", jwt);
                if (expirationTime) {
                    localStorage.setItem("jwtExp", expirationTime.toString());
                } else {
                    throw new Error("Expiration time not found in token");
                }

                router.push("/");
            } else {
                throw new Error("Token not received");
            }
        } catch (err: any) {
            console.error("Login error: ", err); // Debugging ke liye

            // 🌟 Step 1: Ensure we are getting the correct error message
            const errorMessage = err.response?.data?.message || "Login failed";
            console.log("Error Message: ", errorMessage); // Debugging ke liye

            // 🌟 Step 2: Normalize error message to avoid case-sensitive issues
            const normalizedMessage = errorMessage.toLowerCase();

            // 🌟 Step 3: Only show "Account Not Found" toast for correct errors
            if (normalizedMessage.includes("account not found") || normalizedMessage.includes("user not found")) {
                toast.error("Account Not Found", {
                    description: "It seems like your account doesn't exist. Please sign up first.",
                    action: {
                        label: "Sign Up",
                        onClick: () => router.push("/signup"),
                    },
                });
                return; // 🚨 IMPORTANT: Stop execution here so that "Login Failed" toast doesn't show
            }

            // 🌟 Step 4: Show a generic error toast for all other errors
            toast.error("Login Failed", {
                description: errorMessage,
            });
        }
    };
 



    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            {/* Card Wrapper with BorderTrail */}
            <div className="relative h-[500px] w-full max-w-md overflow-hidden rounded-md border border-zinc-950/10 bg-white text-zinc-700 dark:border-zinc-50/20 dark:bg-zinc-950 dark:text-zinc-300">
                <Card className="h-full w-full rounded-md bg-transparent p-6 shadow-none">
                    <CardHeader className="text-center">
                        {/* TextRoll Animation for Card Title */}
                        <TextRoll
                            className="text-2xl font-semibold text-black dark:text-white"
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
                            duration={1.5}
                        >
                            Log In
                        </TextRoll>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" onSubmit={handleSignIn}>
                            {/* Email Field */}
                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </Label>
                                <div className="relative h-[50px] w-full overflow-hidden rounded-md border border-zinc-950/10 bg-white text-zinc-700 mt-1 dark:border-zinc-50/20 dark:bg-zinc-950 dark:text-zinc-300">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm"
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
                                <div className="relative h-[50px] w-full overflow-hidden rounded-md border border-zinc-950/10 bg-white text-zinc-700 mt-1 dark:border-zinc-50/20 dark:bg-zinc-950 dark:text-zinc-300">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm"
                                    />
                                    <BorderTrail
                                        className="bg-linear-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
                                        size={120}
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-sm">
                                    {error}
                                </p>
                            )}

                            {/* Submit Button with Glow Effect */}
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
                                    className="relative inline-flex items-center gap-1 rounded-md bg-zinc-950 px-3 py-1.5 text-sm font-semibold text-zinc-50 outline outline-1"
                                >
                                    Sign In <ArrowRight className="h-4 w-4" />
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
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium underline hover:text-primary">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}

