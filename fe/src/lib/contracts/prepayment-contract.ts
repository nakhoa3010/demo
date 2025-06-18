import { ethers } from 'ethers';

import { BaseInterface } from './interfaces';
import { envConfig } from '@/lib/configs';
import { PREPAYMENT_ABI } from './abis/prepayment-abi';

export default class PrepaymentContract extends BaseInterface {
  constructor(signer?: ethers.providers.JsonRpcSigner, rpcUrl?: string) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl || envConfig.RPC_URL);
    super(rpcProvider, envConfig.PREPAYMENT_ADDRESS, PREPAYMENT_ABI, signer);
  }

  createAccountMutation = async (): Promise<{ hash: string; accId: number }> => {
    const response = await this._contract.createAccount();
    const { hash } = response;
    const event = await this._handleTransactionResponse(response, true, 'AccountCreated');
    const accId = this._toNumber(event['accId']);
    return { hash, accId };
  };

  depositMutation = async (accId: number, amount: number): Promise<{ hash: string }> => {
    const amountInWei = ethers.utils.parseEther(amount.toString());
    const response = await this._contract.deposit(accId, {
      ...this._option,
      value: amountInWei,
    });
    const hash = (await this._handleTransactionResponse(response)) as string;
    return { hash };
  };

  withdrawMutation = async (accId: number, amount: number): Promise<{ hash: string }> => {
    const amountInWei = ethers.utils.parseEther(amount.toString());
    const response = await this._contract.withdraw(accId, amountInWei, this._option);
    const hash = (await this._handleTransactionResponse(response)) as string;
    return { hash };
  };

  addConsumerMutation = async (
    accId: number,
    consumerAddress: string,
  ): Promise<{ hash: string }> => {
    const response = await this._contract.addConsumer(accId, consumerAddress, this._option);
    const hash = (await this._handleTransactionResponse(response)) as string;
    return { hash };
  };

  removeConsumerMutation = async (
    accId: number,
    consumerAddress: string,
  ): Promise<{ hash: string }> => {
    const response = await this._contract.removeConsumer(accId, consumerAddress, this._option);
    const hash = (await this._handleTransactionResponse(response)) as string;
    return { hash };
  };
}
