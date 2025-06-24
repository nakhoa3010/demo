import { ethers } from 'ethers';

import { Erc20 } from './interfaces';
import { ERC_20_ABI } from './abis/erc_20';
import { envConfig } from '@/lib/configs';

export default class ERC20Contract extends Erc20 {
  constructor(contractAddress: string, signer?: ethers.providers.JsonRpcSigner, rpcUrl?: string) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl || envConfig.RPC_URL);
    super(rpcProvider, contractAddress, ERC_20_ABI, signer);
  }
}
