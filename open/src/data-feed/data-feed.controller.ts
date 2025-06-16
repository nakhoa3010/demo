import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { DataFeedService } from './data-feed.service'

@Controller({ path: 'data-feed', version: '1' })
@ApiTags('Data Feed')
export class DataFeedController {
  constructor(private readonly dataFeedService: DataFeedService) {}

  @Get()
  async list() {
    return await this.dataFeedService.list()
  }
}
