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
  consumerCount: number;
}

export interface ConsumerItem {
  id: number;
  address: string;
  status: AccountStatus;
  accId: number;
  requestCount: number;
  spendCount: number;
  txHash: string;
  createdAt: string;
  updatedAt: string;
  lastFulfillment: string;
}

export interface HistoryItem {
  id: number;
  consumerId: number;
  requestId: string;
  txHash: string;
  status: string;
  service: string;
  amount: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
  consumer: string;
}

export interface AccountDetailItem {
  id: number;
  account: string;
  owner: string;
  accType: string;
  balance: string | number;
  status: AccountStatus;
  createdAt: string;
  consumerCount: number;
  consumers: ConsumerItem[];
  history: HistoryItem[];
}
