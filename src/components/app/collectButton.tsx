import { sdk } from "@farcaster/frame-sdk";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { useEffect, useRef, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useConnect, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { contractConfig } from "../../config";
import { isUserRejectionError } from "../../lib/errors";
import { AnimatedBorder } from "../ui/animatedBorder";
import { Button } from "../ui/button";

interface CollectButtonProps {
  timestamp?: number;
  priceEth: string;
  vectorId: number;
  onCollect: () => void;
  onError: (error: string | undefined) => void;
  isMinting: boolean;
  name: string;
  description: string;
}

export function CollectButton({ 
  priceEth, 
  vectorId, 
  onCollect, 
  onError, 
  isMinting, 
  name,
  description 
}: CollectButtonProps) {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}`>();
  const [isLoadingTxData, setIsLoadingTxData] = useState(false);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isPending = isLoadingTxData || isWriting || isConfirming;

  const successHandled = useRef(false);

  useEffect(() => {
    if (isSuccess && !successHandled.current) {
      successHandled.current = true;
      onCollect();
      setHash(undefined);
      successHandled.current = false;
    }
  }, [isSuccess, onCollect]);

  const handleClick = async () => {
    try {
      if (!isMinting) {
        sdk.actions.addFrame();
        return;
      }

      setHash(undefined);
      successHandled.current = false;

      if (!isConnected || !address) {
        connect({ connector: farcasterFrame() });
        return;
      }

      setIsLoadingTxData(true);

      const hash = await writeContractAsync({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "vectorMint721",
        args: [BigInt(vectorId), 1n, address],
        value: parseEther(priceEth),
        chainId: contractConfig.chain.id,
      });

      setHash(hash);
    } catch (error) {
      if (!isUserRejectionError(error)) {
        onError(error instanceof Error ? error.message : "Something went wrong.");
      }
      setHash(undefined);
      successHandled.current = false;
    } finally {
      setIsLoadingTxData(false);
    }
  };

  const handleShare = async () => {
    try {
      const nftId = parseInt(name.split('#')[1]);
      await sdk.actions.composeCast({
        text: `${description}\n\nMint yours: https://fc.miguelgarest.com?nft=${nftId}`,
        embeds: [`https://fc.miguelgarest.com?nft=${nftId}`]
      });
    } catch (error) {
      console.error("Error sharing to Warpcast:", error);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="pb-4 px-4 pt-2">
        {isMinting && (
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-muted text-sm">Cost</span>
            <div className="text-right">
              <span className="text-foreground font-medium">{priceEth} ETH</span>
              <span className="text-muted text-xs ml-2">(~$1 USD)</span>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {isPending ? (
            <div className="flex-1">
              <AnimatedBorder>
                <Button className="w-full relative bg-[#A8B0CD] text-white" disabled>
                  {isMinting ? "Collecting..." : "Adding..."}
                </Button>
              </AnimatedBorder>
            </div>
          ) : (
            <Button 
              className="flex-1 bg-[#A8B0CD] text-white hover:bg-[#9BA3C0]" 
              onClick={handleClick} 
              disabled={isPending}
            >
              {!isConnected && isMinting ? "Connect" : isMinting ? "Collect" : "Add Frame"}
            </Button>
          )}
          
          <Button 
            className="flex-1 bg-[#A8B0CD] text-white hover:bg-[#9BA3C0]" 
            onClick={handleShare}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
