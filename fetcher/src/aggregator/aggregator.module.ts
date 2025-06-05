import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AggregatorController } from './aggregator.controller'
import { AggregatorService } from './aggregator.service'

@Module({
  controllers: [AggregatorController],
  providers: [AggregatorService, PrismaService],
  exports: [AggregatorService]
})
export class AggregatorModule {}
