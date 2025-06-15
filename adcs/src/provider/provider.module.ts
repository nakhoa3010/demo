import { Module } from '@nestjs/common'
import { ProviderService } from './provider.service'
import { ProviderController } from './provider.controller'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [ProviderService, PrismaService],
  controllers: [ProviderController],
  exports: [ProviderService]
})
export class ProviderModule {}
