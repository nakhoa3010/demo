import { ApiProperty } from '@nestjs/swagger'

export class CreateConsumerDto {
  @ApiProperty()
  txHash: string

  @ApiProperty()
  service: string

  @ApiProperty()
  amount: string

  @ApiProperty()
  requestId: string

  @ApiProperty()
  balance: string

  @ApiProperty()
  status: string

  @ApiProperty()
  consumerAddress: string
}
