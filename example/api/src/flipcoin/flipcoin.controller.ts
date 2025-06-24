import { Controller, Get, Param, Post } from '@nestjs/common'
import { FlipcoinService } from './flipcoin.service'

@Controller('flipcoin')
export class FlipcoinController {
  constructor(private readonly flipcoinService: FlipcoinService) {}

  @Post('flip/:txHash')
  async flip(@Param('txHash') txHash: string) {
    return await this.flipcoinService.flip(txHash)
  }

  @Get('history')
  async getHistory() {
    return await this.flipcoinService.getHistory()
  }
}
