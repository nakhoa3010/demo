import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { FlipcoinController } from './flipcoin.controller'
import { FlipcoinService } from './flipcoin.service'

@Module({
  controllers: [FlipcoinController],
  providers: [FlipcoinService, PrismaService],
  exports: [FlipcoinService]
})
export class FlipcoinModule {}
