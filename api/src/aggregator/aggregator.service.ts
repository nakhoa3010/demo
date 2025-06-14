import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { keccak256, toUtf8Bytes } from 'ethers'
import { PrismaService } from '../prisma.service'
import { IAggregator } from './aggregator.types'
import { AggregatorDto } from './dto/aggregator.dto'

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name)

  constructor(private prisma: PrismaService) {}

  async create(aggregatorDto: AggregatorDto) {
    // adapter
    const adapterHash = aggregatorDto.adapterHash
    const adapter = await this.prisma.adapter.findUnique({
      where: { adapterHash }
    })

    if (adapter == null) {
      const msg = `adapter.adapterHash [${adapterHash}] not found`
      this.logger.error(msg)
      throw new HttpException(msg, HttpStatus.NOT_FOUND)
    }

    try {
      const aggregator: IAggregator = {
        aggregatorHash: aggregatorDto.aggregatorHash,
        name: aggregatorDto.name,
        heartbeat: aggregatorDto.heartbeat,
        threshold: aggregatorDto.threshold,
        absoluteThreshold: aggregatorDto.absoluteThreshold,
        adapterHash: aggregatorDto.adapterHash
      }
      await this.computeAggregatorHash({ data: aggregator, verify: true })
    } catch (e) {
      this.logger.error(e)
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
    const chain = await this.prisma.chains.findFirst({ where: { name: aggregatorDto.chain } })
    const data: Prisma.AggregatorUncheckedCreateInput = {
      aggregatorHash: aggregatorDto.aggregatorHash,
      active: aggregatorDto.active,
      name: aggregatorDto.name,
      heartbeat: aggregatorDto.heartbeat,
      threshold: aggregatorDto.threshold,
      absoluteThreshold: aggregatorDto.absoluteThreshold,
      adapterId: adapter.id,
      fetcherType: aggregatorDto.fetcherType,
      address: aggregatorDto.address,
      chainId: chain.chainId
    }

    try {
      return await this.prisma.aggregator.create({ data })
    } catch (e) {
      throw e
    }
  }

  async findAll(params: {
    skip?: number
    take?: number
    cursor?: Prisma.AggregatorWhereUniqueInput
    where?: Prisma.AggregatorWhereInput
    orderBy?: Prisma.AggregatorOrderByWithRelationInput
  }) {
    const { skip, take, cursor, where, orderBy } = params
    return await this.prisma.aggregator.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    })
  }

  async findUnique(aggregatorWhereUniqueInput: Prisma.AggregatorWhereUniqueInput) {
    return await this.prisma.aggregator.findUnique({
      where: aggregatorWhereUniqueInput,
      include: {
        adapter: {
          include: {
            feeds: true
          }
        }
      }
    })
  }

  async findFirst(hash: string, chainName: string) {
    const chain = await this.prisma.chains.findFirst({ where: { name: chainName } })
    return await this.prisma.aggregator.findFirst({
      where: { chainId: chain.chainId, aggregatorHash: hash }
    })
  }

  async remove(where: Prisma.AggregatorWhereUniqueInput) {
    return await this.prisma.aggregator.delete({
      where
    })
  }

  async update(params: { where: Prisma.AggregatorWhereUniqueInput; active: boolean }) {
    const { where, active } = params
    return await this.prisma.aggregator.update({
      data: { active },
      where
    })
  }

  async verifyAggregatorHashOnLoad(aggregatorWhereUniqueInput: Prisma.AggregatorWhereUniqueInput) {
    const aggregatorRecord = await this.findUnique(aggregatorWhereUniqueInput)
    const aggregator: IAggregator = {
      aggregatorHash: aggregatorRecord.aggregatorHash,
      name: aggregatorRecord.name,
      heartbeat: aggregatorRecord.heartbeat,
      threshold: aggregatorRecord.threshold,
      absoluteThreshold: aggregatorRecord.absoluteThreshold,
      adapterHash: aggregatorRecord.adapter.adapterHash
    }
    await this.computeAggregatorHash({ data: aggregator, verify: true })
  }

  async computeAggregatorHash({ data, verify }: { data: IAggregator; verify?: boolean }) {
    const input = JSON.parse(JSON.stringify(data))

    // Don't use following properties in computation of hash
    delete input.aggregatorHash

    const hash = keccak256(toUtf8Bytes(JSON.stringify(input)))

    if (verify && data.aggregatorHash != hash) {
      throw `Hashes do not match!\nExpected ${hash}, received ${data.aggregatorHash}.`
    } else {
      data.aggregatorHash = hash
      return data
    }
  }

  async computeNameHash(name: string) {
    return keccak256(toUtf8Bytes(name))
  }

  async hashAllName() {
    const aggregators = await this.prisma.aggregator.findMany({ where: { nameHash: null } })
    let updated = 0
    for (let i = 0; i < aggregators.length; i++) {
      const agg = aggregators[i]
      const hash = await this.computeNameHash(agg.name)
      await this.prisma.aggregator.update({
        where: { id: agg.id },
        data: { nameHash: hash }
      })
      updated++
    }

    return updated
  }
}
