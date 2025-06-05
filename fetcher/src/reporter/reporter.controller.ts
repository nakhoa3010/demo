import { Body, Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ReporterService } from './reporter.service'

@Controller({ version: '1', path: 'reporter' })
@ApiTags('Reporter')
export class ReporterController {
  constructor(private readonly reporterService: ReporterService) {}

  @Get('oracle-address/:address')
  async oracleAddress(
    @Param('address') address: string,
    @Body('chain') chain: string,
    @Body('service') service: string
  ) {
    return await this.reporterService.reporterByAddress(address, chain, service)
  }
}
