import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { ListenerService } from './listener.service'

describe('ListenerService', () => {
  let listener: ListenerService
  let prisma

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListenerService, PrismaService]
    }).compile()

    listener = module.get<ListenerService>(ListenerService)
    prisma = module.get<PrismaClient>(PrismaService)
  })

  afterEach(async () => {
    jest.resetModules()
    await prisma.$disconnect()
  })

  it('should be defined', () => {
    expect(listener).toBeDefined()
  })
})
