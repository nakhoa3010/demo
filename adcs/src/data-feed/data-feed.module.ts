import { Module } from '@nestjs/common'
import { DataFeedController } from './data-feed.controller'
import { DataFeedService } from './data-feed.service'
import { PrismaService } from '../prisma.service'
import { RedisModule } from '../redis/redis.module'

@Module({
  imports: [RedisModule],
  controllers: [DataFeedController],
  providers: [DataFeedService, PrismaService],
  exports: [DataFeedService]
})
export class DataFeedModule {}
