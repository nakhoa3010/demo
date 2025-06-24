import { FlipCoinAbi } from './abis/flipcoin';
import { envConfig } from '../configs/env-config';
import BaseInterface from './interfaces/BaseInterface';
import { ethers } from 'ethers';

export enum Bet {
  Head = 0,
  Tail = 1,
}

export interface PlayerInfo {
  address: string;
  balance: number;
  winCount: number;
  total: number;
}

export default class FlipCoinContract extends BaseInterface {
  constructor(signer?: ethers.providers.JsonRpcSigner, rpcUrl?: string) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl || envConfig.RPC_URL);
    super(rpcProvider, envConfig.FlipCoinAddress, FlipCoinAbi, signer);
  }

  async flip(bet: Bet, amount: number) {
    const tooWei = ethers.utils.parseEther(amount.toString());
    const rp = await this._contract.flip(bet, {
      ...this._option,
      value: tooWei,
    });
    return this._handleTransactionResponse(rp);
  }

  async getPlayerInfo(address: string) {
    console.log({ getPlayerInfo: address });
    const rp = await this._contract.playerInfors(address);

    return {
      address,
      balance: this._toNumberBalance(rp.balance),
      winCount: this._toNumber(rp.winCount),
      total: this._toNumber(rp.total),
    };
  }
}
