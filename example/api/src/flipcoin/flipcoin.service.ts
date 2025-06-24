import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'
import { abis } from '../abis/flipcoin'
import { FLIPCOIN_ADDRESS } from '../app.settings'
import { PrismaService } from '../prisma.service'

@Injectable()
export class FlipcoinService {
  private provider: ethers.JsonRpcProvider
  private contract: ethers.Contract

  constructor(private readonly prisma: PrismaService) {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    this.contract = new ethers.Contract(FLIPCOIN_ADDRESS, abis, this.provider)
  }

  async flip(txHash: string): Promise<any> {
    try {
      const txReceipt = await this.provider.getTransactionReceipt(txHash)
      if (!txReceipt) {
        throw new Error('Transaction not found')
      }
      const logs = txReceipt.logs.filter(
        (log) => log.address.toLowerCase() === FLIPCOIN_ADDRESS.toLowerCase()
      )
      if (logs.length === 0) {
        throw new Error('FlipCoin transaction not found')
      }
      const flipEvent = this.contract.interface.parseLog(logs[0])
      const { player, bet, betAmount, requestId } = flipEvent.args
      const flipCoinHistory = await this.prisma.flipCoinHistory.create({
        data: {
          txHash,
          address: player,
          amount: betAmount.toString(),
          bet: bet.toString(),
          requestId: requestId.toString()
        }
      })
      return flipCoinHistory
    } catch (error) {
      throw new Error(`Flip failed: ${error.message}`)
    }
  }

  async getHistory(): Promise<any> {
    const flipCoinHistory = await this.prisma.flipCoinHistory.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const result = await Promise.all(
      flipCoinHistory.map(async (history) => {
        const dataResult = await this.contract.requestInfors(history.requestId)
        return {
          ...history,
          betAmount: dataResult.betAmount.toString(),
          hasResult: dataResult.hasResult,
          result: dataResult.result.toString()
        }
      })
    )
    return result
  }
}
