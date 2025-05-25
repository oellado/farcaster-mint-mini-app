import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";

interface TopBarProps {
  onViewCollection: () => void;
  onViewMint: () => void;
  currentView: "collection" | "mint";
}

export function TopBar({ onViewCollection, onViewMint, currentView }: TopBarProps) {
  const [userProfile, setUserProfile] = useState<{ pfpUrl?: string }>({});

  useEffect(() => {
    const initProfile = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.pfpUrl) {
          setUserProfile({
            pfpUrl: context.user.pfpUrl,
          });
        }
      } catch (error) {
        console.error("Failed to get user profile:", error);
      }
    };
    initProfile();
  }, []);

  return (
    <div className="h-16 bg-[#A6B0D0] backdrop-blur-sm border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onViewMint}
            className="text-lg font-semibold text-white hover:text-gray-200"
          >
            Daily vibes
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onViewCollection}
            className={`text-lg font-semibold ${
              currentView === "collection" ? "text-black" : "text-white hover:text-gray-200"
            }`}
          >
            Collection
          </button>
          {userProfile.pfpUrl ? (
            <img
              src={userProfile.pfpUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
          )}
        </div>
      </div>
    </div>
  );
} 