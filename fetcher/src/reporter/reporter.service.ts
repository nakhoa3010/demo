import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ReporterService {
  constructor(private readonly prismaService: PrismaService) {}

  async reporterByAddress(address: string, chainName: string, serviceName: string) {
    const chain = await this.prismaService.chains.findFirst({ where: { name: chainName } })
    const service = await this.prismaService.services.findFirst({ where: { name: serviceName } })
    return this.prismaService.reporters.findMany({
      where: { oracleAddress: address, chainId: chain.chainId, serviceId: service.serviceId }
    })
  }
}
