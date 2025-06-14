import { Injectable } from '@nestjs/common'
import { Reporters } from '@prisma/client'
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

  async reporterByChainAndContract(
    chainName: string,
    contractAddress: string
  ): Promise<Reporters[] | null> {
    const reporters = await this.prismaService.reporters.findMany({
      where: {
        AND: [{ Chains: { name: chainName } }, { oracleAddress: contractAddress.toLowerCase() }]
      }
    })

    const reportersWithRpcs = await Promise.all(
      reporters.map(async (reporter) => {
        const rpcs = await this.prismaService.chainRpc.findMany({
          where: { chainId: reporter.chainId }
        })
        return {
          ...reporter,
          chainRpcs: rpcs
        }
      })
    )
    return reportersWithRpcs
  }
}
