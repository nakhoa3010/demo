import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AdapterController } from './adapter.controller'
import { AdapterService } from './adapter.service'

@Module({
  providers: [PrismaService, AdapterService],
  controllers: [AdapterController]
})
export class AdapterModule {}
