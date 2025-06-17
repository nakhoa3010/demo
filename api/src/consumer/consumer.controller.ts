import { Body, Controller, Post } from '@nestjs/common'
import { ConsumerService } from './consumer.service'
import { CreateConsumerDto } from './dto/create.dto'

@Controller({ path: 'consumer', version: '1' })
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Post('fulfillment')
  async fulfillment(@Body() dto: CreateConsumerDto) {
    return await this.consumerService.addFulfillmentTx(dto)
  }
}
