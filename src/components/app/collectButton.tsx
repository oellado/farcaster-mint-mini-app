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
  onCollect: () => void;
  onError: (error: string | undefined) => void;
  isMinting: boolean;
}

export function CollectButton({ priceEth, onCollect, onError, isMinting }: CollectButtonProps) {
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
        args: [BigInt(contractConfig.vectorId), 1n, address],
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

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="pb-4 px-4 pt-2">
        {isMinting && (
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-muted text-sm">Cost</span>
            <span className="text-foreground font-medium">{priceEth} ETH</span>
          </div>
        )}

        {isPending ? (
          <AnimatedBorder>
            <Button className="w-full relative bg-[var(--color-active)] text-[var(--color-active-foreground)]" disabled>
              {isMinting ? "Collecting..." : "Adding..."}
            </Button>
          </AnimatedBorder>
        ) : (
          <Button className="w-full" onClick={handleClick} disabled={isPending}>
            {!isConnected && isMinting ? "Connect" : isMinting ? "Collect" : "Add Frame"}
          </Button>
        )}
      </div>
    </div>
  );
}
