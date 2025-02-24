"use client";
import { EditProfileForm } from "@/components/forms/EditProfileForm";
import React from "react";

type EditProfileFormWrapperProps = {
  onSaveProfile: (data: {
    name?: string;
    phone?: string;
    area?: string;
    bio?: string;
    profilePicture?: File | null;
    removeAvatar?: boolean;
  }) => void;
  userProfile: {
    name: string;
    email: string;
    role: string;
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
  return <EditProfileForm userProfile={userProfile} onSaveProfile={onSaveProfile} />;
}
