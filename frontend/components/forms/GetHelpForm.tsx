"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { GlowEffect } from "../core/glow-effect";

// 1. Zod schema for validation
const getHelpFormSchema = z.object({
    fullName: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    helpType: z.string().min(1, { message: "Please select a help type" }),
    description: z.string().min(1, { message: "Description is required" }),
});

export function GetHelpForm() {
    // 2. Create the form with react-hook-form + zod
    const form = useForm<z.infer<typeof getHelpFormSchema>>({
        resolver: zodResolver(getHelpFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            location: "",
            helpType: "",
            description: "",
        },
    });

    // 3. Submit handler
    function onSubmit(values: z.infer<typeof getHelpFormSchema>) {
        console.log("Form Data:", values);
        // You can call your API here...
        form.reset();
    }

    // 4. Return the form
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Your location" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="helpType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Help Type</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-none focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm"
                                >
                                    <option value="">Select help type</option>
                                    <option value="medical">Medical</option>
                                    <option value="technical">Technical</option>
                                    <option value="other">Other</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe your issue" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                        Submit <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </Form>
    );
}
