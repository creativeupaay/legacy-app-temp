import React, { useState, useEffect } from "react";
import { Avatar, Button, IconButton } from "@/components/ui";
import { theme } from "@/theme/theme";
import type { IProfile } from "../types/profile.types";
import { Camera } from "lucide-react";

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: IProfile | null;
  onSave: (data: { fullName: string }) => Promise<void>;
  onUploadImage: (file: File) => Promise<any>;
  isLoading?: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onUploadImage,
  isLoading = false,
}) => {
  const [fullName, setFullName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || profile.email.split("@")[0] || "");
      setPreviewImage(profile.avatar || null);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previousImage = previewImage;
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setError(null);
    setUploadNotice(null);

    try {
      setIsUploading(true);
      const res = await onUploadImage(file);
      if (res?.message) {
        setUploadNotice(res.message);
      }
    } catch (err: any) {
      setPreviewImage(previousImage);
      setError(err?.data?.message || "Image upload failed. Reverted preview.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Full name cannot be empty.");
      return;
    }
    try {
      setError(null);
      await onSave({ fullName: fullName.trim() });
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to update profile.");
    }
  };

  const email = profile?.email || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: theme.colors.surface.default,
          borderColor: theme.colors.stroke.border,
        }}
        className="w-full max-w-[340px] sm:max-w-[380px] rounded-[24px] p-5 sm:p-6 shadow-xl border flex flex-col gap-4 sm:gap-5 animate-in zoom-in-95 duration-200 relative box-border"
      >
        <div className="flex items-center justify-between">
          <h3
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
            className="text-[16px] sm:text-[18px] font-bold tracking-tight m-0"
          >
            Edit Profile
          </h3>
          <IconButton
            variant="close"
            onClick={onClose}
            aria-label="Close edit profile modal"
            disabled={isLoading || isUploading}
          />
        </div>

        {error && (
          <div
            style={{
              backgroundColor: theme.colors.surface.elevated,
              borderColor: theme.colors.primary.motivationBorder,
              color: theme.colors.text.primary,
            }}
            className="text-xs p-3 rounded-xl border font-medium shadow-sm flex items-center gap-2"
          >
            <span
              style={{
                backgroundColor: theme.colors.primary.motivation,
                color: theme.colors.primary.action,
              }}
              className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0"
            >
              !
            </span>
            <span>{error}</span>
          </div>
        )}

        {uploadNotice && (
          <div
            style={{
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.stroke.blue,
              color: theme.colors.primary.action,
            }}
            className="text-xs p-3 rounded-xl border font-medium shadow-sm"
          >
            {uploadNotice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex flex-col items-center justify-center gap-1.5 my-1">
            <div className="relative group cursor-pointer">
              <Avatar
                src={previewImage || undefined}
                name={fullName}
                size="md"
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full text-lg sm:text-xl font-bold border-2 shadow-sm"
                style={{ borderColor: theme.colors.stroke.yellow }}
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
              >
                <Camera className="w-5 h-5" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={isLoading || isUploading}
                className="hidden"
              />
            </div>
            <span
              style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.sans }}
              className="text-[11px] sm:text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/[0.04]"
            >
              {isUploading ? "Uploading..." : "Tap photo to change"}
            </span>
          </div>

          <div>
            <label
              style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.sans }}
              className="block text-[11px] sm:text-xs font-semibold mb-1 tracking-tight"
            >
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              disabled={isLoading || isUploading}
              style={{
                backgroundColor: theme.colors.surface.elevated,
                borderColor: theme.colors.stroke.border,
                color: theme.colors.text.primary,
              }}
              className="w-full text-[13px] sm:text-sm py-2 px-3 sm:px-3.5 rounded-xl border outline-none transition-all font-medium focus:ring-2 focus:ring-[#1C274C]/10 box-border"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.sans }}
                className="block text-[11px] sm:text-xs font-semibold tracking-tight"
              >
                Email Address
              </label>
              <span
                style={{ color: theme.colors.text.tertiary || "#A1A1AA" }}
                className="text-[10px] font-medium"
              >
                Read-only
              </span>
            </div>
            <input
              type="email"
              readOnly
              value={email}
              disabled
              style={{
                backgroundColor: theme.colors.surface.neutral,
                borderColor: theme.colors.stroke.border,
                color: theme.colors.text.secondary,
              }}
              className="w-full text-[13px] sm:text-sm py-2 px-3 sm:px-3.5 rounded-xl border cursor-not-allowed font-medium select-none box-border"
            />
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 mt-2 pt-1">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isLoading || isUploading}
              className="flex-1 !text-[13px] !py-2.5 !px-2 !rounded-xl font-semibold whitespace-nowrap tracking-tight shrink-0"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1 !text-[13px] !py-2.5 !px-2 !rounded-xl font-semibold whitespace-nowrap tracking-tight shrink-0"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
