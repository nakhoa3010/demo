import { ApiProperty } from '@nestjs/swagger'

export class QueryDto {
  @ApiProperty()
  chain: string

  @ApiProperty()
  service: string
}
