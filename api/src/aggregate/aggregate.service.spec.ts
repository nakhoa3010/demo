import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { RedisClientType } from '@redis/client'
import { AdapterService } from '../adapter/adapter.service'
import { AggregatorService } from '../aggregator/aggregator.service'
import { PrismaService } from '../prisma.service'
import { RedisService } from '../redis.service'
import { AggregateService } from './aggregate.service'

describe('AggregateService', () => {
  let aggregator: AggregatorService
  let adapter: AdapterService
  let aggregate: AggregateService
  let prisma: any
  let redis: any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdapterService, AggregatorService, AggregateService, PrismaService, RedisService]
    }).compile()

    aggregator = module.get<AggregatorService>(AggregatorService)
    adapter = module.get<AdapterService>(AdapterService)
    aggregate = module.get<AggregateService>(AggregateService)
    prisma = module.get<PrismaClient>(PrismaService)
    redis = module.get<RedisClientType>(RedisService)

    await module.init()
  })

  afterEach(async () => {
    jest.resetModules()
    await prisma.$disconnect()
    await redis.onApplicationShutdown()
  })

  it('should be defined', () => {
    expect(aggregate).toBeDefined()
    expect(aggregator).toBeDefined()
    expect(adapter).toBeDefined()
  })
})
