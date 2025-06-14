import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CronController } from './cron.controller'
import { CronService } from './cron.service'

@Module({
  providers: [CronService, PrismaService],
  controllers: [CronController]
})
export class CronModule {}
