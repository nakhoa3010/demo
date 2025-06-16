/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { AccountItem } from '../views/recent-accounts';

export default function AccountItemComp({ item }: { item: AccountItem }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <img src={item.accountLogo} alt={item.address} className="size-10 rounded-full" />
      </div>
    </div>
  );
}
