import { useMutation } from '@tanstack/react-query';
import PrepaymentContract from '@/lib/contracts/prepayment-contract';
import { getEthersSigner } from '@/lib/hooks/useEtherSigner';

export default function useRemoveConsumer() {
  const { mutateAsync: removeConsumer, isPending } = useMutation({
    mutationFn: async ({ accId, consumerAddress }: { accId: number; consumerAddress: string }) => {
      const signer = await getEthersSigner();
      if (!signer) {
        throw new Error('please_connect_wallet_first');
      }
      const prepaymentContract = new PrepaymentContract(signer);
      const result = await prepaymentContract.removeConsumerMutation(accId, consumerAddress);
      return result.hash;
    },
  });

  return { removeConsumer, isRemoveConsumerPending: isPending };
}
