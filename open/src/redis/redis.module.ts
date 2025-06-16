import { Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../app.settings'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: REDIS_HOST,
          port: Number(REDIS_PORT),
          password: REDIS_PASSWORD,
          db: 0
        })
      },
      inject: [ConfigService]
    },
    RedisService
  ],
  exports: [RedisService]
})
export class RedisModule {}
