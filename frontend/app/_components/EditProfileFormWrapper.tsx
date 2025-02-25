"use client";
import React from "react";
import { EditProfileForm } from "@/components/forms/EditProfileForm";

type EditProfileFormWrapperProps = {
  onSaveProfile: (data: any) => void;
  userProfile: {
    name: string;
    email: string;
    roles?: string[];
    phone?: string;
    area?: string;
    bio?: string;
    avatarUrl: string | null;
  };
};

export function EditProfileFormWrapper({
  onSaveProfile,
  userProfile,
}: EditProfileFormWrapperProps) {
  return (
    <EditProfileForm
      onSaveProfile={onSaveProfile}
      userProfile={{
        name: userProfile.name,
        email: userProfile.email,
        // For basic details, join roles (if any) into a string:
        role: userProfile.roles ? userProfile.roles.join(", ") : "USER",
        phone: userProfile.phone,
        area: userProfile.area,
        bio: userProfile.bio,
        avatarUrl: userProfile.avatarUrl,
      }}
    />
  );
}
