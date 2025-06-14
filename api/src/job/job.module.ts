import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { AggregateModule } from '../aggregate/aggregate.module'
import { AggregatorModule } from '../aggregator/aggregator.module'
import { FETCHER_QUEUE_NAME } from '../app.settings'
import { DataModule } from '../data/data.module'
import { JobController } from './job.controller'
import { JobProcessor } from './job.processor'
import { JobService } from './job.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: FETCHER_QUEUE_NAME,
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379
      }
    }),
    DataModule,
    AggregateModule,
    AggregatorModule
  ],
  controllers: [JobController],
  providers: [JobService, JobProcessor]
})
export class JobModule {}
