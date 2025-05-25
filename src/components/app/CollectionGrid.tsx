import { type NFT } from "../../config";

interface NFTWithQuantity extends NFT {
  quantity: number;
}

interface CollectionGridProps {
  nfts: NFTWithQuantity[];
  onSelectNFT: (nft: NFTWithQuantity) => void;
}

export function CollectionGrid({ nfts, onSelectNFT }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {nfts.map((nft) => (
        <div
          key={nft.id}
          className="relative"
        >
          <div 
            className={`aspect-square rounded-lg overflow-hidden bg-gray-900 ${
              nft.quantity === 0 ? 'opacity-50 blur-[2px]' : ''
            }`}
            onClick={() => nft.quantity > 0 && onSelectNFT(nft)}
          >
            <img
              src={nft.imageUrl}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Quantity badge */}
          <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-sm font-medium">
            x{nft.quantity}
          </div>

          {/* NFT info - always visible for NFTs with quantity > 0 */}
          {nft.quantity > 0 && (
            <div className="mt-2 text-center">
              <h3 className="font-bold text-sm">{nft.name}</h3>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 