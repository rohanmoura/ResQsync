"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { withAuth } from "@/app/_components/withAuth"; // Import the HOC

function ProfilePage() {

    const router = useRouter();



    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Profile Header */}
            <Card>
                <CardHeader className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl font-semibold">Username</CardTitle>
                        <p className="text-muted-foreground text-sm">user@gmail.com</p>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}

export default ProfilePage;
