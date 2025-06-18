import { useMutation } from '@tanstack/react-query';
import PrepaymentContract from '@/lib/contracts/prepayment-contract';
import { getEthersSigner } from '@/lib/hooks/useEtherSigner';

export default function useWithdraw() {
  const { mutateAsync: withdraw, isPending } = useMutation({
    mutationFn: async ({ accId, amount }: { accId: number; amount: number }) => {
      const signer = await getEthersSigner();
      if (!signer) {
        throw new Error('please_connect_wallet_first');
      }
      const prepaymentContract = new PrepaymentContract(signer);
      const result = await prepaymentContract.withdrawMutation(accId, amount);

      return result;
    },
  });

  return { withdraw, isPending };
}
