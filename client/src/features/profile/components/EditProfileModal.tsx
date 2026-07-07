import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui";
import { theme } from "@/theme/theme";
import type { IProfile } from "../types/profile.types";
import { Camera, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        style={{ backgroundColor: theme.colors.surface.default }}
        className="w-full max-w-sm rounded-[24px] p-6 shadow-xl border border-gray-100 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200 relative"
      >
        <div className="flex items-center justify-between">
          <h3
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
            className="text-lg font-bold"
          >
            Edit Profile
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading || isUploading}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {uploadNotice && (
          <div className="text-xs text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-200">
            {uploadNotice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-2 my-2">
            <div className="relative group cursor-pointer">
              <Avatar
                src={previewImage || undefined}
                name={fullName}
                size="lg"
                className="w-20 h-20 rounded-full text-2xl font-bold border-2 border-[#2B7FCE]/20 shadow-sm"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
              >
                <Camera className="w-6 h-6" />
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
              style={{ color: theme.colors.text.secondary }}
              className="text-xs font-medium"
            >
              {isUploading ? "Uploading image..." : "Tap photo to change"}
            </span>
          </div>

          <div>
            <label
              style={{ color: theme.colors.text.secondary }}
              className="block text-xs font-semibold uppercase tracking-wider mb-1"
            >
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              disabled={isLoading || isUploading}
              className="w-full text-sm py-2.5 px-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#2B7FCE] transition-colors font-medium"
            />
          </div>

          <div>
            <label
              style={{ color: theme.colors.text.secondary }}
              className="block text-xs font-semibold uppercase tracking-wider mb-1"
            >
              Email Address (Read-Only)
            </label>
            <input
              type="email"
              readOnly
              value={email}
              disabled
              className="w-full text-sm py-2.5 px-3.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed font-medium select-none"
            />
          </div>

          <div className="flex items-center gap-3 mt-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || isUploading}
              style={{ color: theme.colors.text.secondary }}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploading}
              style={{
                backgroundColor: theme.colors.primary.action,
                color: theme.colors.text.inverse,
              }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center justify-center shadow-sm"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
