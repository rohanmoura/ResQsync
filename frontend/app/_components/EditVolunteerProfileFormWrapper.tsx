"use client";
import React from "react";
import { EditVolunteerProfileForm } from "@/components/forms/EditVolunteerProfileForm";

type EditVolunteerProfileFormWrapperProps = {
    onSaveProfile: (data: any) => void;
    userProfile: {
        volunteeringTypes?: string[];
        skills?: string[];
        about?: string;
    };
};


export function EditVolunteerProfileFormWrapper({
    onSaveProfile,
    userProfile,
}: EditVolunteerProfileFormWrapperProps) {
    return (
        <EditVolunteerProfileForm
            onSaveProfile={onSaveProfile}
            userProfile={{
                volunteeringTypes: userProfile.volunteeringTypes,
                skills: userProfile.skills,
                about: userProfile.about,
            }}
        />
    );
}
