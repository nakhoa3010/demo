import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { VrfService } from './vrf.service'

describe('VrfService', () => {
  let vrf: VrfService
  let prisma

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VrfService, PrismaService]
    }).compile()

    vrf = module.get<VrfService>(VrfService)
    prisma = module.get<PrismaClient>(PrismaService)
  })

  afterAll(async () => {
    jest.resetModules()
    await prisma.$disconnect()
  })

  it('should be defined', () => {
    expect(vrf).toBeDefined()
  })
})
