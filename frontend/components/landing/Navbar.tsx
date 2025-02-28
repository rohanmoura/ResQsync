"use client";
import Link from "next/link";
import { useEffect, useState, useRef, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ToogleMode";
import { AnimatedBackground } from "@/components/core/animated-background";
import { GlowEffect } from "@/components/core/glow-effect";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bell, FilePlus } from "lucide-react";
import { toast } from "sonner";

// Shadcn UI Tooltip imports
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// Dialog components for report submission
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";

export default function Navbar() {
    const [user, setUser] = useState<{ name: string; profilePicture?: string; roles?: string[] } | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [lastUploadedFileName, setLastUploadedFileName] = useState<string | null>(null);
    const router = useRouter();
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Base TABS for navigation
    const TABS = [
        { label: "About Us", href: "#about" },
        { label: "Solutions", href: "#solutions" },
        { label: "Process", href: "#process" },
        { label: "Hospital Data", href: "/hospital-data" },
        { label: "News Data", href: "/news-data" },
    ];

    useEffect(() => {
        async function checkAuthStatus() {
            const token = localStorage.getItem("jwtToken");
            const exp = localStorage.getItem("jwtExp");

            if (token && exp) {
                const now = Math.floor(Date.now() / 1000);
                if (now > parseInt(exp)) {
                    console.log("Token expired! Logging out...");
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("jwtExp");
                    setIsAuthenticated(false);
                    setUser(null);
                    router.push("/");
                } else {
                    setIsAuthenticated(true);
                    try {
                        const response = await axios.get("http://localhost:8081/api/user/profile", {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (response.data) {
                            setUser({
                                name: response.data.name || "User",
                                profilePicture: response.data.profilePicture || "",
                                roles: response.data.roles || [],
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching profile:", error);
                        setUser({ name: "User", profilePicture: "", roles: [] });
                    }
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        checkAuthStatus();
    }, [router]);

    // Condition for Help Requests tab: shown when user has role USER along with VOLUNTEER or HELPREQUESTER
    const showHelpRequests =
        user?.roles?.includes("USER") &&
        (user?.roles?.includes("VOLUNTEER") || user?.roles?.includes("HELPREQUESTER"));

    // Condition for Reports tab: shown when user has role USER and either HOSPITAL or (only USER without VOLUNTEER/HELPREQUESTER)
    const showReportsTab =
        user?.roles?.includes("USER") &&
        (user?.roles?.includes("HOSPITAL") ||
            (!user?.roles?.includes("VOLUNTEER") && !user?.roles?.includes("HELPREQUESTER")));

    // New condition for Manager tab: shown when user has role USER and MANAGER
    const showManagerTab =
        user?.roles?.includes("USER") && user?.roles?.includes("MANAGER");

    // Build dynamic tabs based on conditions.
    // If user is a Manager, add "Volunteer Req".
    // Also, if the user has MANAGER role, add "Hospital Req" (both open the same page).
    const dynamicTabs: { label: string; href: string }[] = [];
    if (showManagerTab) {
        dynamicTabs.push({ label: "Volunteer Req", href: "/manager" });
    }
    if (user?.roles?.includes("MANAGER")) {
        dynamicTabs.push({ label: "Hospital Req", href: "/hospital-req" });
    }
    // New condition: if roles include both USER and HOSPITAL, add "All Reports" tab.
    if (user?.roles?.includes("USER") && user?.roles?.includes("HOSPITAL")) {
        dynamicTabs.push({ label: "All Reports", href: "/all-reports" });
    }
    // Fallback to existing conditions if no dynamic tab was added.
    if (dynamicTabs.length === 0) {
        if (showHelpRequests) {
            dynamicTabs.push({ label: "Help Requests", href: "/help-request" });
        } else if (showReportsTab) {
            dynamicTabs.push({ label: "Reports", href: "/reports" });
        }
    }
    const finalTabs = [...TABS, ...dynamicTabs];

    // Close mobile menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    // Handle click for "Add Reports" icon
    const handleAddReportClick = () => {
        if (isAuthenticated) {
            setShowReportDialog(true);
        } else {
            toast("Authentication Required", {
                description: "If you want to add reports, you have to log in",
                action: {
                    label: "Signin",
                    onClick: () => router.push("/signin"),
                },
            });
        }
    };

    // Handle file selection
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === "application/pdf") {
                setSelectedFile(file);
            } else {
                toast.error("Please select a valid PDF file.");
            }
        }
    };

    // Handle PDF upload submission with size & duplicate name validation (10 MB max)
    const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error("Please select a PDF file before uploading.");
            return;
        }
        // Check for duplicate file name
        if (lastUploadedFileName && selectedFile.name === lastUploadedFileName) {
            toast.error("Duplicate file upload is not allowed. Please select a different file.");
            return;
        }
        // Validate file size (10 MB maximum)
        const maxSize = 10 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            setShowReportDialog(false);
            toast.error("The file is too large. It cannot be greater than 10 MB.");
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append("pdf", selectedFile);
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.post("http://localhost:8081/api/reports/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
            toast.success("Report uploaded successfully!");
            setLastUploadedFileName(selectedFile.name);
            setSelectedFile(null);
            setShowReportDialog(false);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload report.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-[hsl(var(--card))] shadow-md">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" prefetch={false} className="text-xl font-bold text-primary">
                        ResQSync
                    </Link>

                    {/* Center: Navigation Menu */}
                    <div className="hidden md:flex space-x-8 relative">
                        <AnimatedBackground
                            defaultValue={finalTabs[0].label}
                            className="rounded-lg bg-zinc-100 dark:bg-zinc-800"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                            enableHover
                        >
                            {finalTabs.map((tab, index) => (
                                <Link
                                    key={index}
                                    href={tab.href}
                                    prefetch={tab.href.startsWith("#") ? false : undefined}
                                    data-id={tab.label}
                                    className="px-4 py-1.5 text-base font-medium text-foreground transition-colors duration-300 hover:text-primary dark:text-zinc-400 dark:hover:text-zinc-50"
                                >
                                    {tab.label}
                                </Link>
                            ))}
                        </AnimatedBackground>
                    </div>

                    {/* Right side: Add Reports, Notifications, ModeToggle, Auth */}
                    <div className="flex items-center space-x-7">
                        {/* Add Reports Icon */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleAddReportClick}
                                        className="p-2 rounded-full hover:bg-indigo-500 hover:text-white transition-colors"
                                    >
                                        <FilePlus className="w-5 h-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>Add Reports</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Notifications Icon (shown if help requests are available) */}
                        {showHelpRequests && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="p-2 rounded-full hover:bg-indigo-500 hover:text-white transition-colors">
                                            <Bell className="w-5 h-5" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Notifications</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <ModeToggle />

                        {/* Profile or Log In */}
                        <div className="relative inline-block">
                            <GlowEffect
                                colors={["#6366F1", "#818CF8", "#A78BFA", "#C7D2FE"]}
                                mode="colorShift"
                                blur="medium"
                                duration={2}
                                scale={1.1}
                            />
                            {isAuthenticated ? (
                                <Link href="/profile" passHref prefetch={false}>
                                    <Avatar className="cursor-pointer border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-600 transition-all">
                                        {user?.profilePicture ? (
                                            <AvatarImage
                                                src={`data:image/png;base64,${user.profilePicture}`}
                                                alt="User Avatar"
                                                onError={(e) => (e.currentTarget.src = "")}
                                            />
                                        ) : (
                                            <AvatarFallback>{user?.name.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                        )}
                                    </Avatar>
                                </Link>
                            ) : (
                                <Link href="/signin" passHref prefetch={false}>
                                    <Button
                                        variant="ghost"
                                        className="relative inline-flex items-center gap-1 rounded-md px-4 py-2 font-semibold bg-transparent text-zinc-950 border border-zinc-300 dark:border-zinc-700 dark:text-zinc-50 hover:bg-indigo-500 hover:text-white hover:border-transparent dark:hover:bg-indigo-600 dark:hover:text-white dark:hover:border-transparent"
                                    >
                                        Log In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary focus:outline-none">
                            ☰
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="absolute top-full left-0 w-full bg-[hsl(var(--card))] shadow-md mt-2 py-4 z-40"
                    >
                        {finalTabs.map((tab, index) => (
                            <Link
                                key={index}
                                href={tab.href}
                                prefetch={tab.href.startsWith("#") ? false : undefined}
                                className="block px-4 py-2 text-base font-medium text-foreground hover:text-primary dark:text-zinc-400 dark:hover:text-zinc-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            {/* Dialog for Adding Reports with PDF Uploader */}
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                <DialogContent className="sm:max-w-[425px] rounded-lg p-6 bg-[hsl(var(--card))] shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-primary font-bold">Add Report</DialogTitle>
                        <DialogDescription className="text-muted text-sm">
                            Please select and upload your PDF report (max 10 MB).
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="mt-6 space-y-4">
                        <label htmlFor="pdf-upload" className="block text-sm font-medium text-foreground">
                            Choose PDF File
                        </label>
                        <input
                            id="pdf-upload"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-foreground border border-border rounded-lg cursor-pointer bg-secondary p-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-secondary dark:border-gray-600"
                        />
                        {selectedFile && (
                            <p className="text-xs text-muted-foreground">
                                Selected file: <span className="font-medium">{selectedFile.name}</span>
                            </p>
                        )}
                        <div className="flex justify-end space-x-3 pt-2">
                            <Button variant="outline" type="button" onClick={() => setShowReportDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!selectedFile || isUploading}>
                                {isUploading ? "Uploading..." : "Upload"}
                            </Button>
                        </div>
                    </form>
                    <DialogClose className="absolute top-2 right-2 text-muted hover:text-foreground" />
                </DialogContent>
            </Dialog>
        </>
    );
}
