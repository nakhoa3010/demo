import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { keccak256, toUtf8Bytes } from 'ethers'
import { PrismaService } from '../prisma.service'
import { AdapterDto } from './dto/adapter.dto'
@Injectable()
export class AdapterService {
  private readonly logger = new Logger(AdapterService.name)

  constructor(private prisma: PrismaService) {}

  async create(adapterDto: AdapterDto) {
    const data: Prisma.AdapterCreateInput = {
      adapterHash: adapterDto.adapterHash,
      name: adapterDto.name,
      decimals: adapterDto.decimals,
      feeds: {
        create: adapterDto.feeds
      }
    }

    try {
      await this.computeAdapterHash({ data: adapterDto, verify: true })
    } catch (e) {
      this.logger.error(e)
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }

    try {
      return await this.prisma.adapter.create({ data })
    } catch (e) {
      console.log('error', e)
      throw e
    }
  }

  async findAll(params: {
    skip?: number
    take?: number
    cursor?: Prisma.AdapterWhereUniqueInput
    where?: Prisma.AdapterWhereInput
    orderBy?: Prisma.AdapterOrderByWithRelationInput
  }) {
    const { skip, take, cursor, where, orderBy } = params
    return await this.prisma.adapter.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    })
  }

  async findOne(adapterWhereUniqueInput: Prisma.AdapterWhereUniqueInput) {
    return await this.prisma.adapter.findUnique({
      where: adapterWhereUniqueInput,
      include: {
        feeds: true
      }
    })
  }

  async remove(where: Prisma.AdapterWhereUniqueInput) {
    return await this.prisma.adapter.delete({
      where
    })
  }

  async computeAdapterHash({
    data,
    verify
  }: {
    data: AdapterDto
    verify?: boolean
  }): Promise<AdapterDto> {
    const input = JSON.parse(JSON.stringify(data))
    delete input.adapterHash
    const hash = keccak256(toUtf8Bytes(JSON.stringify(input)))
    if (verify && data.adapterHash != hash) {
      throw new HttpException(
        `Hashes do not match!\nExpected ${hash}, received ${data.adapterHash}.`,
        HttpStatus.BAD_REQUEST
      )
    } else {
      data.adapterHash = hash
      return data
    }
  }
}
