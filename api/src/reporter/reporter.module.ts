import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ReporterController } from './reporter.controller'
import { ReporterService } from './reporter.service'

@Module({
  providers: [ReporterService, PrismaService],
  controllers: [ReporterController]
})
export class ReporterModule {}
