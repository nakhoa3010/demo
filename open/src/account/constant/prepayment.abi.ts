export const PREPAYMENT_ACCOUNT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint64',
        name: 'accId',
        type: 'uint64'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'enum IAccount.AccountType',
        name: 'accType',
        type: 'uint8'
      }
    ],
    name: 'AccountCreated',
    type: 'event'
  }
]
