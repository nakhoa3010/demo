import { Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AccountService } from './account.service'

@Controller({ path: 'account', version: '1' })
@ApiTags('Account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async all() {
    return await this.accountService.all()
  }

  @Post('create/:txHash')
  async create(@Param('txHash') txHash: string) {
    return await this.accountService.createPrepaymentAccount(txHash)
  }
}
