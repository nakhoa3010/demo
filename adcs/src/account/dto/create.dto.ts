import { ApiProperty } from '@nestjs/swagger'

export class CreatePrepaymentAccountDto {
  @ApiProperty({ description: 'Account ID' })
  accountId: number

  @ApiProperty({ description: 'Address of the account' })
  address: string

  @ApiProperty({ description: 'Tx hash of the account' })
  txHash: string
}
