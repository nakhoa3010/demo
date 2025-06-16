import { useMutation } from '@tanstack/react-query';
import PrepaymentContract from '@/lib/contracts/prepayment-contract';
import { getEthersSigner } from '@/lib/hooks/useEtherSigner';

export default function useAddConsumer() {
  const { mutateAsync: addConsumer, isPending } = useMutation({
    mutationFn: async ({ accId, consumerAddress }: { accId: number; consumerAddress: string }) => {
      const signer = await getEthersSigner();
      if (!signer) {
        throw new Error('please_connect_wallet_first');
      }
      const prepaymentContract = new PrepaymentContract(signer);
      const result = await prepaymentContract.addConsumerMutation(accId, consumerAddress);
      console.log('add consumer result', result);
      return result;
    },
  });

  return { addConsumer, isConsumerPending: isPending };
}
