"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GetHelpToast() {
    const router = useRouter();

    return (
        <Button
            onClick={() => {
                toast("Authentication Required", {
                    description: "To get help, please sign up first.",
                    action: {
                        label: "Sign Up",
                        onClick: () => router.push("/signup"),
                    },
                });
            }}
            className="w-full bg-primary hover:bg-primary-dark text-white"
        >
            Get Help
        </Button>
    );
}
