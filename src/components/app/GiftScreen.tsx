import { useState } from "react";
import { type NFT } from "../../config";

const NEYNAR_API_KEY = "30558204-7AF3-44A6-9756-D14BBB60F5D2";

interface GiftScreenProps {
  onBack: () => void;
  onGift: (recipientFid: number) => void;
}

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

export function GiftScreen({ onBack, onGift }: GiftScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FarcasterUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string>();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(undefined);

    try {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "api_key": NEYNAR_API_KEY,
          },
        }
      );

      if (response.status === 402) {
        setError("Neynar API: Payment Required. Please upgrade your Neynar plan to use user search.");
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();
      console.log('Neynar API response:', data);
      if (data.users) {
        setSearchResults(data.users.map((user: any) => ({
          fid: user.fid,
          username: user.username,
          displayName: user.display_name,
          pfpUrl: user.pfp_url,
        })));
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search users. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md w-full">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-800 hover:text-gray-900"
          >
            ← Back
          </button>
          <h2 className="text-xl font-semibold ml-4">Gift NFT</h2>
        </div>
        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or FID..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A6B0D0] placeholder:text-gray-400"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-[#A6B0D0] text-white rounded-lg font-semibold hover:bg-[#9BA3C0] transition-colors disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-500 text-sm">{error}</p>
          )}
        </div>
        <div className="space-y-4">
          {searchResults.map((user) => (
            <div
              key={user.fid}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer"
              onClick={() => onGift(user.fid)}
            >
              <img
                src={user.pfpUrl}
                alt={user.displayName}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-4">
                <div className="font-semibold">{user.displayName}</div>
                <div className="text-sm text-gray-500">@{user.username}</div>
              </div>
            </div>
          ))}
          {searchResults.length === 0 && !isSearching && searchQuery && (
            <p className="text-center text-gray-500">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
} 