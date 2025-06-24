import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FlipcoinModule } from './flipcoin/flipcoin.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    BullModule,
    FlipcoinModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService]
})
export class AppModule {}
