export enum AccountStatus {
  SUCCESS = 'active',
  INPROGRESS = 'inprogress',
}

export interface AccountItem {
  id: number;
  account: string;
  txHash: string;
  owner: string;
  accType: string;
  status: AccountStatus;
  createdAt: string;
  balance: string;
  consumer: number;
}
