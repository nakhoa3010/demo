import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FeedService } from './feed.service'

@Controller({
  path: 'feed',
  version: '1'
})
@ApiTags('Feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async findAll() {
    return await this.feedService.findAll({ orderBy: { id: 'asc' } })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.feedService.findOne({ id: Number(id) })
  }
}
