import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";

import { ArtworkCard } from "./components/app/artworkCard";
import { CollectButton } from "./components/app/collectButton";
import { MintErrorSheet } from "./components/app/mintErrorSheet";
import { MintSuccessSheet } from "./components/app/mintSuccessSheet";
import { WelcomeScreen } from "./components/app/WelcomeScreen";
import { TopBar } from "./components/app/TopBar";
import { CollectionGrid } from "./components/app/CollectionGrid";
import { nftCollection, type NFT } from "./config";

type AppState = "welcome" | "minting" | "collection" | "artwork";
type View = "mint" | "collection";

interface NFTWithQuantity extends NFT {
  quantity: number;
}

function App() {
  const [isReady, setIsReady] = useState(false);
  const [appState, setAppState] = useState<AppState>("welcome");
  const [currentView, setCurrentView] = useState<View>("mint");
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>();
  
  // Mock data for minted NFTs - in a real app, this would come from a contract or backend
  const [mintedNfts, setMintedNfts] = useState<NFTWithQuantity[]>(
    nftCollection.nfts.map((nft, index) => ({ 
      ...nft, 
      // Add some test editions: first NFT has 2, second has 1, rest have 0
      quantity: index === 0 ? 2 : index === 1 ? 1 : 0 
    }))
  );

  // Initialize SDK
  useEffect(() => {
    const initSDK = async () => {
      try {
        await sdk.actions.ready();
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize SDK:", error);
        // Still set ready to true to show the app
        setIsReady(true);
      }
    };
    initSDK();
  }, []);

  const handleStart = () => {
    const randomIndex = Math.floor(Math.random() * nftCollection.nfts.length);
    const nft = nftCollection.nfts[randomIndex];
    setSelectedNft(nft);
    setAppState("minting");
    setCurrentView("mint");
    setShowSuccess(false);
    setError(undefined);
  };

  const handleMintSuccess = () => {
    if (selectedNft) {
      setMintedNfts(prev => 
        prev.map(nft => 
          nft.id === selectedNft.id 
            ? { ...nft, quantity: nft.quantity + 1 }
            : nft
        )
      );
    }
    setShowSuccess(true);
  };

  const handleViewCollection = () => {
    setAppState("collection");
    setCurrentView("collection");
  };

  const handleViewMint = () => {
    setAppState("welcome");
    setCurrentView("mint");
    setSelectedNft(null);
  };

  const handleSelectNFT = (nft: NFTWithQuantity) => {
    if (nft.quantity > 0) {
      setSelectedNft(nft);
      setAppState("artwork");
    }
  };

  const handleShareNFT = async (nft: NFTWithQuantity) => {
    // TODO: Implement Farcaster cast sharing
    console.log("Share NFT:", nft);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#DCE5FF] flex items-center justify-center">
        <div className="text-xl text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DCE5FF] flex flex-col">
      <TopBar
        onViewCollection={handleViewCollection}
        onViewMint={handleViewMint}
        currentView={currentView}
      />
      
      <main className="flex-1 relative pt-16">
        {appState === "welcome" && (
          <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-4rem)]">
            <WelcomeScreen onStart={handleStart} />
          </div>
        )}

        {appState === "collection" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 overflow-auto">
            <CollectionGrid
              nfts={mintedNfts}
              onSelectNFT={handleSelectNFT}
            />
          </div>
        )}

        {appState === "artwork" && selectedNft && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-md w-full">
              <button
                onClick={() => setAppState("collection")}
                className="absolute -top-12 right-0 text-white text-2xl font-bold hover:text-gray-300"
              >
                ×
              </button>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={selectedNft.imageUrl}
                  alt={selectedNft.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleShareNFT({ ...selectedNft, quantity: mintedNfts.find(n => n.id === selectedNft.id)?.quantity ?? 0 })}
                  className="flex-1 py-3 px-6 bg-[#A8B0CD] text-white rounded-lg text-lg font-semibold hover:bg-[#9BA3C0] transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {appState === "minting" && selectedNft && (
          <div className="absolute inset-0 p-4 overflow-auto">
            <div className="max-w-md mx-auto">
              <ArtworkCard
                key={selectedNft.id}
                imageUrl={selectedNft.imageUrl}
                name={selectedNft.name}
                creator={{
                  name: selectedNft.creator.name,
                  profileImageUrl: selectedNft.creator.profileImageUrl,
                  fid: selectedNft.creator.fid
                }}
                chain={selectedNft.chain}
                description={selectedNft.description}
                isMinting={true}
              >
                <div className="flex gap-4 mt-4">
                  <CollectButton
                    key={`collect-${selectedNft.id}`}
                    priceEth={selectedNft.priceEth}
                    isMinting={true}
                    onCollect={handleMintSuccess}
                    onError={setError}
                  />
                </div>
              </ArtworkCard>
            </div>
          </div>
        )}
      </main>

      <MintSuccessSheet
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        name={selectedNft?.name ?? ""}
        imageUrl={selectedNft?.imageUrl ?? ""}
      />
      <MintErrorSheet 
        isOpen={!!error} 
        onClose={() => setError(undefined)} 
        error={error} 
      />
    </div>
  );
}

export default App;
