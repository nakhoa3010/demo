import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { UserPlus, Vault, Wallet } from 'lucide-react';
import React, { useState } from 'react';
import CreateAccountStep from './create-account-step';
import AddDepositStep from './add-deposit-step';
import AddConsumerStep from './add-consumer-step';

const steps = [
  <Wallet key="1" className="size-8 text-green-300" />,
  <Vault key="2" className="size-8 text-green-300" />,
  <UserPlus key="3" className="size-8 text-green-300" />,
];

interface CreateAccountContentProps {
  address: string;
  onDoItLater?: () => void;
}

type StepValue = 'CREATE_ACCOUNT' | 'ADD_DEPOSIT' | 'ADD_CONSUMER';

export default function CreateAccountContent({ address, onDoItLater }: CreateAccountContentProps) {
  const [currentStep, setCurrentStep] = useState<StepValue>('CREATE_ACCOUNT');
  const [accId, setAccId] = useState<number | null>(1);

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={cn(
                  'rounded-12 bg-5 flex w-fit items-center justify-center border p-2',
                  index === 0 && 'border-green-300',
                  index === 1 && 'border-green-800 bg-neutral-900',
                  index === 2 && 'bg-neutral-90 border-green-800',
                )}
              >
                {step}
              </div>
              {index < steps.length - 1 && (
                <div className="h-[2px] w-10 rounded-full bg-green-800" />
              )}
            </div>
          ))}
        </div>
        <SheetTitle />
      </SheetHeader>

      {currentStep === 'CREATE_ACCOUNT' && (
        <CreateAccountStep
          address={address}
          onDoItLater={onDoItLater}
          onSuccess={(accId) => {
            setAccId(accId);
            setCurrentStep('ADD_DEPOSIT');
          }}
        />
      )}
      {currentStep === 'ADD_DEPOSIT' && accId && (
        <AddDepositStep accId={accId} onSuccess={() => setCurrentStep('ADD_CONSUMER')} />
      )}
      {currentStep === 'ADD_CONSUMER' && accId && (
        <AddConsumerStep accId={accId} onSuccess={() => onDoItLater?.()} />
      )}
    </>
  );
}
