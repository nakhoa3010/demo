import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../prisma.service'
import { CronService } from './cron.service'

describe('CronService', () => {
  let service: CronService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronService, PrismaService]
    }).compile()

    service = module.get<CronService>(CronService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
