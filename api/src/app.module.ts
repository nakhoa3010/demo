import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AdapterModule } from './adapter/adapter.module'
import { AggregateModule } from './aggregate/aggregate.module'
import { AggregatorModule } from './aggregator/aggregator.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CronModule } from './cron/cron.module'
import { DataModule } from './data/data.module'
import { FeedModule } from './feed/feed.module'
import { JobModule } from './job/job.module'
import { ListenerModule } from './listener/listener.module'
import { ReporterModule } from './reporter/reporter.module'
import { VrfModule } from './vrf/vrf.module'
import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    BullModule,
    AdapterModule,
    FeedModule,
    AggregatorModule,
    AggregateModule,
    DataModule,
    JobModule,
    CronModule,
    ReporterModule,
    ListenerModule,
    VrfModule,
    ConsumerModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService]
})
export class AppModule {}
