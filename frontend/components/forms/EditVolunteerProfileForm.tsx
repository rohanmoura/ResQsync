"use client";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";

const volunteerTypeOptions = [
    "MEDICAL_ASSISTANCE",
    "PATIENT_SUPPORT",
    "ADMINISTRATIVE_SUPPORT",
    "COMMUNITY_HEALTH",
    "EMERGENCY_RESPONSE",
    "COUNSELING_SUPPORT",
    "TECHNICAL_IT_SUPPORT",
];

const editVolunteerProfileFormSchema = z.object({
    volunteeringTypes: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    about: z.string().optional(),
});

type FormValues = z.infer<typeof editVolunteerProfileFormSchema>;

export type EditVolunteerProfileFormProps = {
    onSaveProfile: (data: FormValues) => void;
    userProfile: {
        volunteeringTypes?: string[];
        skills?: string[];
        about?: string;
    };
};

export function EditVolunteerProfileForm({
    onSaveProfile,
    userProfile,
}: EditVolunteerProfileFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(editVolunteerProfileFormSchema),
        defaultValues: {
            volunteeringTypes: userProfile.volunteeringTypes || [],
            skills: userProfile.skills || [],
            about: userProfile.about || "",
        },
    });

    // Watch the volunteer types for checkbox status
    const watchedVolunteerTypes = useWatch({
        control: form.control,
        name: "volunteeringTypes",
    });

    const [skillInput, setSkillInput] = useState("");
    // EDIT: Initialize localSkills with deduplicated skills
    const [localSkills, setLocalSkills] = useState<string[]>(Array.from(new Set(userProfile.skills || [])));

    useEffect(() => {
        if (userProfile) { // Ensure userProfile is available
            form.reset({
                volunteeringTypes: userProfile.volunteeringTypes || [],
                skills: userProfile.skills || [],
                about: userProfile.about || "",
            });
            setLocalSkills(Array.from(new Set(userProfile.skills || [])));
        }
    }, [userProfile, form]); // Dependency array ensures it updates on first open

    const onSubmit = (values: FormValues) => {
        onSaveProfile({ ...values, skills: localSkills });
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const skill = skillInput.trim();
            if (!skill) return;
            if (localSkills.includes(skill)) return;
            const updatedSkills = [...localSkills, skill];
            setLocalSkills(updatedSkills);
            setSkillInput("");
            form.setValue("skills", updatedSkills);
        }
    };

    const removeSkill = (skill: string) => {
        const updated = localSkills.filter((s) => s !== skill);
        setLocalSkills(updated);
        form.setValue("skills", updated);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-card-foreground">Edit Volunteer Details</h2>
                    <p className="text-sm text-muted-foreground">
                        Update your volunteer-specific information
                    </p>
                </div>
                <Separator className="border-muted-foreground" />

                {/* Volunteer Types */}
                <div>
                    <FormLabel className="mb-2 block">Volunteer Types</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                        {volunteerTypeOptions.map((type) => (
                            <label key={type} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={type}
                                    checked={watchedVolunteerTypes?.includes(type) || false}
                                    onChange={(e) => {
                                        const current = form.getValues("volunteeringTypes") || [];
                                        if (e.target.checked) {
                                            form.setValue("volunteeringTypes", [...current, type]);
                                        } else {
                                            form.setValue(
                                                "volunteeringTypes",
                                                current.filter((t: string) => t !== type)
                                            );
                                        }
                                    }}
                                />
                                <span className="text-sm">{type.replace(/_/g, " ")}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <FormLabel className="mb-2 block">Skills</FormLabel>
                    <Input
                        type="text"
                        placeholder="Type a skill and press Enter"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                    />
                    <div className="flex flex-wrap mt-2 gap-2">
                        {localSkills.map((skill) => (
                            <div key={skill} className="flex items-center bg-gray-200 dark:bg-gray-700 rounded px-2 py-1">
                                <span className="text-sm">{skill}</span>
                                <button type="button" onClick={() => removeSkill(skill)} className="ml-1 text-xs text-red-500">
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Volunteer Reason */}
                <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reason for Volunteering</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter your reason for volunteering" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                            form.reset();
                            setLocalSkills(Array.from(new Set(userProfile.skills || [])));
                        }}
                    >
                        Reset
                    </Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Form>
    );
}
