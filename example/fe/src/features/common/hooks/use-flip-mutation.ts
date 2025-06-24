import { useMutation } from '@tanstack/react-query';
import FlipCoinContract, { Bet } from '@/lib/contracts/flip-coin-contract';
import { getEthersSigner } from '@/lib/hooks/useEtherSigner';

export const useFlipMutation = () => {
  const { mutateAsync: flip, isPending } = useMutation({
    mutationFn: async ({ bet, amount }: { bet: Bet; amount: number }) => {
      const signer = await getEthersSigner();

      if (!signer) {
        throw new Error('No signer found');
      }

      const flipCoinContract = new FlipCoinContract(signer);
      return flipCoinContract.flip(bet, amount);
    },
  });

  return { flip, isPending };
};
