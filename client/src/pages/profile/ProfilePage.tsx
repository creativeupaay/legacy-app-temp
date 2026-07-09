import React, { useState } from "react";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadProfileImageMutation,
  useGetProfileInsightsQuery,
  ProfileCard,
  EditProfileModal,
  ProfileInsights,
  ProfileRecipients,
  ProfileSettingsCard,
} from "@/features/profile";
import {
  useGetContactsQuery,
  useCreateContactMutation,
} from "@/features/journal/api/journalApi";
import type { ICreateContactRequest } from "@/features/journal/types/contacts.types";

const ProfilePage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Queries
  const { data: profileResponse, isLoading: isLoadingProfile } = useGetMyProfileQuery();
  const { data: insightsResponse, isLoading: isLoadingInsights } = useGetProfileInsightsQuery();
  const { data: contacts = [], isLoading: isLoadingContacts } = useGetContactsQuery();

  // Mutations
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();
  const [uploadProfileImage] = useUploadProfileImageMutation();
  const [createContact, { isLoading: isAddingContact }] = useCreateContactMutation();

  const profile = profileResponse?.data?.profile || null;
  const insights = insightsResponse?.data?.insights || undefined;

  const handleUpdateProfile = async (data: { fullName: string }) => {
    await updateProfile(data).unwrap();
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return await uploadProfileImage(formData).unwrap();
  };

  const handleAddContact = async (data: ICreateContactRequest) => {
    await createContact(data).unwrap();
  };

  return (
    <div className="w-full max-w-full mx-auto flex flex-col gap-8 sm:gap-10 pt-3 sm:pt-4 pb-24 sm:pb-28 animate-in fade-in duration-200">
      <ProfileCard
        profile={profile}
        isLoading={isLoadingProfile}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      <ProfileInsights
        insights={insights}
        isLoading={isLoadingInsights}
      />

      <ProfileRecipients
        contacts={contacts}
        isLoading={isLoadingContacts}
        onAddContact={handleAddContact}
        isAdding={isAddingContact}
      />

      <ProfileSettingsCard />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleUpdateProfile}
        onUploadImage={handleUploadImage}
        isLoading={isUpdating}
      />

      {/* Bottom Blur Overlay constrained to app width (max-w-[480px]) */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div
          className="w-full max-w-[480px] h-[140px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(242, 243, 238, 0) 0%, rgba(242, 243, 238, 0.4) 55%, rgba(242, 243, 238, 0.88) 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
          }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
