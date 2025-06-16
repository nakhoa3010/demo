import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { join } from 'path'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { MODE, REDIS_HOST, REDIS_PORT } from './app.settings'
import { BullModule } from '@nestjs/bullmq'
import { AuthModule } from './auth/auth.module'
import { InferenceModule } from './inference/inference.module'
import { ProviderModule } from './provider/provider.module'
import { AdapterModule } from './adapter/adapter.module'
import { AiModule } from './ai/ai.module'
import { AccountModule } from './account/account.module'
import { DataFeedModule } from './data-feed/data-feed.module'
import { RedisModule } from './redis/redis.module'

@Module({
  imports: [
    CacheModule.register({
      ttl: 1000,
      max: 20,
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 5000,
        limit: 50
      }
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', MODE == 'dev' ? '' : '..', 'data'),
      serveRoot: '/fragmentz'
    }),
    BullModule.forRoot({
      connection: {
        host: REDIS_HOST,
        port: Number(REDIS_PORT)
      }
    }),
    AdapterModule,
    AuthModule,
    InferenceModule,
    ProviderModule,
    AdapterModule,
    AiModule,
    AccountModule,
    DataFeedModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
