import { Module } from '@nestjs/common'
import { AdapterService } from './adapter.service'
import { AdapterController } from './adapter.controller'
import { PrismaService } from '../prisma.service'
import { ProviderModule } from '../provider/provider.module'
import { AiModule } from '../ai/ai.module'

@Module({
  imports: [ProviderModule, AiModule],
  providers: [AdapterService, PrismaService],
  controllers: [AdapterController]
})
export class AdapterModule {}
