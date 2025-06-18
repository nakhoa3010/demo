import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ConsumerController } from './consumer.controller'
import { ConsumerService } from './consumer.service'

@Module({
  controllers: [ConsumerController],
  providers: [ConsumerService, PrismaService]
})
export class ConsumerModule {}
