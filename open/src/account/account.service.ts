import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Interface, JsonRpcProvider } from 'ethers'
import { PREPAYMENT_ACCOUNT_ADDRESS, RPC_URL } from '../app.settings'
import { PREPAYMENT_ACCOUNT_ABI } from './constant/prepayment.abi'

@Injectable()
export class AccountService {
  provider: JsonRpcProvider
  constructor(private prisma: PrismaService) {
    this.provider = new JsonRpcProvider(RPC_URL)
  }

  async all() {
    const accounts = await this.prisma.prepaymentAccount.findMany()
    const accountBalances = []
    for (const acc of accounts) {
      const balance = await this.provider.getBalance(acc.account)
      accountBalances.push({
        ...acc,
        balance: balance.toString()
      })
    }
    return accountBalances
  }

  async createPrepaymentAccount(txHash: string) {
    const receipt = await this.provider.getTransactionReceipt(txHash)
    if (receipt.status !== 1) {
      throw new Error('Transaction failed')
    }
    if (receipt.to.toLowerCase() !== PREPAYMENT_ACCOUNT_ADDRESS.toLowerCase()) {
      throw new Error('Invalid contract address')
    }
    const event = receipt.logs.find(
      (log) => log.address.toLowerCase() === PREPAYMENT_ACCOUNT_ADDRESS.toLowerCase()
    )
    if (!event) {
      throw new Error('Event not found')
    }

    const iface = new Interface(PREPAYMENT_ACCOUNT_ABI)
    const parsedEvent = iface.parseLog(event)
    if (parsedEvent.name !== 'AccountCreated') {
      throw new Error('Invalid event')
    }
    const { accId, account, owner, accType } = parsedEvent.args
    const accountUser = await this.prisma.prepaymentAccount.upsert({
      where: { account },
      update: {},
      create: { account, txHash, owner, accType: accType.toString(), id: Number(accId) }
    })
    return accountUser
  }
}
