import type { Abi, Address } from "viem";
import { base } from "viem/chains";

export interface NFT {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  creator: {
    name: string;
    fid: number;
    profileImageUrl: string;
  };
  chain: string;
  priceEth: string;
}

/**
 * NFT Metadata Configuration
 */
export const mintMetadata = {
  name: "Mini App Mint Demo",
  description:
    "A simple example of an onchain action in a Farcaster mini app. Tap the button below to mint this image.",
  imageUrl: "https://mint-demo.replit.app/nft.png",
  creator: {
    name: "horsefacts.eth",
    fid: 3621,
    profileImageUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/27ebb092-6f26-4397-6027-8c90d909ce00/original",
  },
  chain: "Base",
  priceEth: "0.0004",
  startsAt: null,
  endsAt: null,
  isMinting: true,
} as const;

/**
 * NFT Collection Configuration
 */
export const nftCollection = {
  name: "Daily vibes",
  description: "",
  welcomeImageUrl: "https://fc.miguelgarest.com/fc/icon.png",
  nfts: [
    {
      id: 1,
      name: "Farcaster NFT #1",
      description: "The first piece in our Farcaster collection",
      imageUrl: "https://fc.miguelgarest.com/fc/0.gif",
      creator: {
        name: "Miguelgarest.eth",
        fid: 323251,
        profileImageUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/dd4ee967-70fa-46f4-90cc-55a7f47bc000/original",
      },
      chain: "Base",
      priceEth: "0.0004",
    },
    {
      id: 2,
      name: "Farcaster NFT #2",
      description: "The second piece in our Farcaster collection",
      imageUrl: "https://fc.miguelgarest.com/fc/1.gif",
      creator: {
        name: "Miguelgarest.eth",
        fid: 323251,
        profileImageUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/dd4ee967-70fa-46f4-90cc-55a7f47bc000/original",
      },
      chain: "Base",
      priceEth: "0.0004",
    },
    {
      id: 3,
      name: "Farcaster NFT #3",
      description: "The third piece in our Farcaster collection",
      imageUrl: "https://fc.miguelgarest.com/fc/2.gif",
      creator: {
        name: "Miguelgarest.eth",
        fid: 323251,
        profileImageUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/dd4ee967-70fa-46f4-90cc-55a7f47bc000/original",
      },
      chain: "Base",
      priceEth: "0.0004",
    },
    {
      id: 4,
      name: "Farcaster NFT #4",
      description: "The fourth piece in our Farcaster collection",
      imageUrl: "https://fc.miguelgarest.com/fc/3.gif",
      creator: {
        name: "Miguelgarest.eth",
        fid: 323251,
        profileImageUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/dd4ee967-70fa-46f4-90cc-55a7f47bc000/original",
      },
      chain: "Base",
      priceEth: "0.0004",
    },
    {
      id: 5,
      name: "Farcaster NFT #5",
      description: "The fifth piece in our Farcaster collection",
      imageUrl: "https://fc.miguelgarest.com/fc/4.gif",
      creator: {
        name: "Miguelgarest.eth",
        fid: 323251,
        profileImageUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/dd4ee967-70fa-46f4-90cc-55a7f47bc000/original",
      },
      chain: "Base",
      priceEth: "0.0004",
    },
  ] as NFT[],
} as const;

/**
 * Contract Configuration
 */
export const contractConfig = {
  address: "0x8087039152c472Fa74F47398628fF002994056EA" as Address,
  chain: base,
  abi: [
    { inputs: [], name: "MintPaused", type: "error" },
    { inputs: [], name: "InvalidPaymentAmount", type: "error" },
    { inputs: [], name: "SenderNotDirectEOA", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "vectorId", type: "uint256" },
        { internalType: "uint48", name: "numTokensToMint", type: "uint48" },
        { internalType: "address", name: "mintRecipient", type: "address" },
      ],
      name: "vectorMint721",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "vectorId",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "bool",
          name: "onChainVector",
          type: "bool",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "numMinted",
          type: "uint256",
        },
      ],
      name: "NumTokenMint",
      type: "event",
    },
  ] as const as Abi,
  vectorId: 6506,
  referrer: "0x075b108fC0a6426F9dEC9A5c18E87eB577D1346a" as Address,
} as const;

/**
 * Farcaster Frame Embed Configuration
 */
export const embedConfig = {
  version: "next",
  imageUrl: nftCollection.welcomeImageUrl,
  button: {
    title: "Try me!",
    action: {
      type: "launch_frame",
      name: "Daily vibes",
      url: "https://mint-mini-app.vercel.app/",
    },
  },
} as const;

/**
 * Main App Configuration
 */
export const config = {
  collection: nftCollection,
  contract: contractConfig,
  embed: embedConfig,
} as const;
