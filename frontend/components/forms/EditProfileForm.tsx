"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { Separator } from "@/components/ui/separator";

const editProfileFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  role: z.string().optional(),
  phone: z.string().optional(),
  area: z.string().optional(),
  bio: z.string().optional(),
  profilePicture: z
    .any()
    .refine((value) => {
      if (!value) return true;
      if (value instanceof FileList) {
        if (value.length === 0) return true;
        return value[0].type.startsWith("image/");
      }
      if (value instanceof File) {
        return value.type.startsWith("image/");
      }
      return false;
    }, { message: "Only image files are accepted" })
    .optional(),
});

type FormValues = z.infer<typeof editProfileFormSchema>;

export type EditProfileFormProps = {
  onSaveProfile: (data: FormValues & { removeAvatar: boolean }) => void;
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

export function EditProfileForm({ onSaveProfile, userProfile }: EditProfileFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      name: userProfile.name || "",
      email: userProfile.email || "",
      role: userProfile.role || "",
      phone: userProfile.phone || "",
      area: userProfile.area || "",
      bio: userProfile.bio || "",
      profilePicture: null,
    },
  });

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(userProfile.avatarUrl);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  useEffect(() => {
    form.reset({
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      phone: userProfile.phone || "",
      area: userProfile.area || "",
      bio: userProfile.bio || "",
      profilePicture: null,
    });
    setCurrentAvatarUrl(userProfile.avatarUrl);
    setAvatarRemoved(false);
  }, [userProfile, form]);

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [userProfile]);

  const onSubmit = (values: FormValues) => {
    onSaveProfile({ ...values, removeAvatar: avatarRemoved });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ref: formFileRef } = form.register("profilePicture");

  // Updated previewUrl logic:
  // - If the URL starts with "http" or "blob:" use it directly.
  // - If length > 100, assume it's a base64 string.
  //   If it starts with "/9j/", assume it's JPEG, otherwise use PNG.
  // - Otherwise, treat it as a relative URL.
  const previewUrl = currentAvatarUrl
    ? currentAvatarUrl.startsWith("http") || currentAvatarUrl.startsWith("blob:")
      ? currentAvatarUrl
      : currentAvatarUrl.length > 100
        ? currentAvatarUrl.startsWith("/9j/")
          ? `data:image/jpeg;base64,${currentAvatarUrl}`
          : `data:image/png;base64,${currentAvatarUrl}`
        : `http://localhost:8081/${currentAvatarUrl}`
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCurrentAvatarUrl(URL.createObjectURL(file));
      setAvatarRemoved(false);
      form.setValue("profilePicture", file);
    } else {
      form.setValue("profilePicture", null);
    }
  };

  const handleRemoveAvatar = () => {
    setCurrentAvatarUrl(null);
    setAvatarRemoved(true);
    form.setValue("profilePicture", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-card-foreground">Edit Profile</h2>
          <p className="text-sm text-muted-foreground">
            Update your personal information
          </p>
        </div>
        <Separator className="border-muted-foreground" />

        {/* Avatar Preview & File Input */}
        <div className="flex flex-col items-center space-y-2">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
              <Button
                variant="outline"
                type="button"
                onClick={handleRemoveAvatar}
                className="absolute -bottom-2 -right-2 text-xs"
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No avatar selected</p>
          )}
          <div className="w-full">
            <Input
              type="file"
              accept="image/*"
              name="profilePicture"
              ref={(e) => {
                formFileRef(e);
                fileInputRef.current = e;
              }}
              onChange={handleFileChange}
              className="w-full"
            />
            {form.formState.errors.profilePicture && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.profilePicture.message as string}
              </p>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your user name" {...field} ref={nameInputRef} />
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
                <Input type="email" placeholder="Enter your email" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="User Role" {...field} disabled />
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
                <Input type="tel" placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area</FormLabel>
              <FormControl>
                <Input placeholder="Enter your area" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
