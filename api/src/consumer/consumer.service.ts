import { Injectable } from '@nestjs/common'
import { JsonRpcProvider } from 'ethers'
import { RPC_URL } from '../app.settings'
import { PrismaService } from '../prisma.service'
import { CreateConsumerDto } from './dto/create.dto'

@Injectable()
export class ConsumerService {
  private provider: JsonRpcProvider
  constructor(private readonly prisma: PrismaService) {
    this.provider = new JsonRpcProvider(RPC_URL)
  }

  async addFulfillmentTx(dto: CreateConsumerDto) {
    const consumer = await this.prisma.consumer.findFirst({
      where: { address: dto.consumerAddress.toLowerCase() }
    })

    const tx = await this.prisma.consumerRequest.create({
      data: {
        txHash: dto.txHash,
        requestId: dto.requestId,
        service: dto.service,
        amount: dto.amount,
        balance: dto.balance,
        status: dto.status,
        Consumer: { connect: { id: consumer.id } }
      }
    })
    return tx
  }
}
