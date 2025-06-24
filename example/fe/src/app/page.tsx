'use client';

import { AppButton, Wrapper } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFlipMutation } from '@/features/common/hooks/use-flip-mutation';
import useGetHistoryQuery from '@/features/common/hooks/use-get-history-query';
import { useGetPlayerInfoQuery } from '@/features/common/hooks/use-get-player-info-query';
import usePostTxHasMutation from '@/features/common/hooks/use-post-txhas-mutation';
import { Bet } from '@/lib/contracts/flip-coin-contract';
import useToast from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatWithDecimals } from '@/lib/utils/format';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';

const picksOptions = ['Head', 'Tail'];

const options = [0.01, 0.05, 0.1, 0.5, 1, 2, 10, 50, 100, 500, 1000];

export default function Home() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { toastSuccess, toastError } = useToast();

  const [pick, setPick] = useState<string>(picksOptions[0]);
  const [amount, setAmount] = useState<number>();

  const { flip, isPending } = useFlipMutation();
  const { mutateAsync: postTxHas, isPending: isPostTxHasPending } = usePostTxHasMutation();
  const { history, isPending: isHistoryPending, refetch: refetchHistory } = useGetHistoryQuery();

  const { data: playerInfo, refetch } = useGetPlayerInfoQuery(address || '');

  const handlePick = async () => {
    try {
      if (!address) {
        openConnectModal?.();
        return;
      }

      const tx = await flip({ bet: pick === 'Head' ? Bet.Head : Bet.Tail, amount: amount || 0 });
      await postTxHas(tx as string);
      setPick(pick);

      refetch();
      refetchHistory();
      if (tx) {
        toastSuccess('Flip successful');
      }
    } catch (ex) {
      toastError('Flip failed');
    }
  };

  return (
    <Wrapper className="flex min-h-screen gap-20">
      <div className="mt-20 flex flex-1 flex-col gap-4">
        <div className="flex justify-center gap-4">
          {picksOptions.map((option) => (
            <div key={option} onClick={() => setPick(option)} className="flex-1">
              <AppButton
                text={option}
                size="48"
                className={cn(
                  'w-full',
                  pick === option ? 'bg-green-500 text-white' : 'bg-transparent',
                )}
                onClick={() => setPick(option)}
              />
            </div>
          ))}
        </div>

        <div className="border-white-10 mt-10 flex w-full gap-4 rounded-lg border p-4">
          <div className="flex flex-1 flex-col items-center gap-2">
            <Typography.Caption text="Balance" />
            <Typography.Body text={playerInfo?.balance.toString() || '0'} />
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <Typography.Caption text="Win Count" />
            <Typography.Body text={playerInfo?.winCount.toString() || '0'} />
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <Typography.Caption text="Total" />
            <Typography.Body text={playerInfo?.total.toString() || '0'} />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-4">
          {options.map((option) => (
            <div className="flex-1" key={option} onClick={() => setPick(option.toString())}>
              <AppButton
                variant={amount === option ? 'primary' : 'secondary-gray'}
                text={option.toString() + ' ETH'}
                size="48"
                className={cn(
                  'w-full',
                  amount === option ? 'bg-green-500 text-white' : 'bg-transparent',
                )}
                onClick={() => setAmount(option)}
              />
            </div>
          ))}
        </div>

        <div className="mt-20 flex gap-4">
          <AppButton
            text={address ? (isPending ? 'Flipping...' : 'Flip Now') : 'Connect Wallet'}
            size="48"
            variant="primary"
            className="w-full"
            isLoading={isPending || isPostTxHasPending}
            onClick={handlePick}
          />
        </div>
      </div>

      <div className="mt-20 h-full flex-1">
        <div className="flex flex-col gap-4">
          <ScrollArea className="border-white-10 flex h-[500px] w-full flex-col gap-4 rounded-lg border p-4">
            {history?.map((item, index) => (
              <div
                key={index}
                className="rounded-12 border-white-10 mb-4 flex w-full gap-4 border p-4"
              >
                <div className="flex flex-1 flex-col items-center gap-2">
                  <Typography.Caption text="Transaction Hash" />
                  <Typography.Body
                    variant="12_regular"
                    text={`${item.txHash.slice(0, 6)}...${item.txHash.slice(-4)}`}
                    className="text-white"
                  />
                </div>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <Typography.Caption text="Address" />
                  <Typography.Body
                    variant="12_regular"
                    text={`${item.address.slice(0, 6)}...${item.address.slice(-4)}`}
                    className="text-white"
                  />
                </div>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <Typography.Caption text="Bet Amount" />
                  <Typography.Body
                    variant="12_regular"
                    text={`${formatWithDecimals(item.betAmount)} ETH`}
                    className="text-white"
                  />
                </div>

                <div className="flex flex-1 flex-col items-center gap-2">
                  <Typography.Caption text="Result" />
                  <Typography.Body
                    variant="12_regular"
                    text={item.result === item.bet ? 'Win' : 'Lose'}
                    className={cn('text-green-300', item.result !== item.bet && 'text-red-500')}
                  />
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </Wrapper>
  );
}
