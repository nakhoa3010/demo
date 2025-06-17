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
        balance: balance.toString(),
        consumerCount: await this.prisma.consumer.count({
          where: { accId: acc.id }
        })
      })
    }
    return accountBalances
  }

  async detail(accId: number) {
    const account = await this.prisma.prepaymentAccount.findUnique({
      where: { id: accId },
      include: {
        Consumer: {
          include: {
            ConsumerRequest: true
          }
        }
      }
    })
    if (!account) {
      throw new Error('Account not found')
    }
    const balance = await this.provider.getBalance(account.account)
    const returnData = {
      id: account.id,
      account: account.account,
      owner: account.owner,
      accType: account.accType,
      status: account.status,
      balance: balance.toString(),
      createdAt: account.createdAt,
      consumerCount: account.Consumer.length,
      consumers: account.Consumer.map((consumer) => ({
        ...consumer,
        requestCount: consumer.ConsumerRequest.length,
        spendCount: consumer.ConsumerRequest.reduce((acc, curr) => acc + Number(curr.amount), 0),
        ConsumerRequest: undefined
      })),
      history: account.Consumer.flatMap((consumer) =>
        consumer.ConsumerRequest.map((request) => ({
          ...request,
          consumer: consumer.address
        }))
      )
    }
    return returnData
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
      where: { account: account.toLowerCase() },
      update: {},
      create: {
        account: account.toLowerCase(),
        txHash,
        owner: owner.toLowerCase(),
        accType: accType.toString(),
        id: Number(accId)
      }
    })
    return accountUser
  }

  async createConsumer(txHash: string) {
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
    const iface = new Interface(PREPAYMENT_ACCOUNT_ABI)
    const parsedEvent = iface.parseLog(event)

    if (parsedEvent.name !== 'AccountConsumerAdded') {
      throw new Error('Invalid event')
    }
    const { accId, consumer } = parsedEvent.args

    if (!event) {
      throw new Error('Event not found')
    }
    const consumerDB = await this.prisma.consumer.create({
      data: { accId: Number(accId), address: consumer.toLowerCase(), status: 'active', txHash }
    })
    return consumerDB
  }
}
