"use client";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { GlowEffect } from "@/components/core/glow-effect";
import { ArrowRight } from "lucide-react";

export type ActionItem = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

type ActionDropdownProps = {
    actions: ActionItem[];
    triggerLabel?: string;
};

const ActionDropdown: React.FC<ActionDropdownProps> = ({
    actions,
    triggerLabel = "Choose Your Role",
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="relative inline-block">
                    <GlowEffect
                        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
                        mode="colorShift"
                        blur="soft"
                        duration={3}
                        scale={1}
                    />
                    <button
                        type="button"
                        className="relative inline-flex items-center gap-1 rounded-md bg-zinc-950 px-3 py-1.5 text-sm font-semibold text-zinc-50 outline outline-1"
                    >
                        {triggerLabel} <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {actions.map((action, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={action.onClick}
                        disabled={action.disabled}
                    >
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionDropdown;
