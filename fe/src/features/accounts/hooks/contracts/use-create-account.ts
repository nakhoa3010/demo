import PrepaymentContract from '@/lib/contracts/prepayment-contract';
import { getEthersSigner } from '@/lib/hooks/useEtherSigner';
import { useMutation } from '@tanstack/react-query';

export default function useCreateAccount() {
  const { mutateAsync: createAccount, isPending } = useMutation({
    mutationFn: async () => {
      const signer = await getEthersSigner();
      if (!signer) {
        throw new Error('please_connect_wallet_first');
      }
      const prepaymentContract = new PrepaymentContract(signer);
      const result = await prepaymentContract.createAccountMutation();
      return result;
    },
  });

  return { createAccount, isPending };
}
