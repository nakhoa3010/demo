import React, { useMemo, useState, useRef, useEffect } from 'react';
import Typography from '../typography';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DropdownItem } from '@/types/common-type';
interface IAppSelectProps {
  label?: string;
  isRequired?: boolean;
  options: DropdownItem[];
  className?: string;
  placeholder?: string;
  value?: string | number;
  error?: string;
  contentClassName?: string;
  onValueChange?: (value: string | number) => void;
  disabled?: boolean;
}

export default function AppSelect({
  label,
  isRequired,
  className,
  placeholder,
  value,
  options,
  error,
  onValueChange,
  contentClassName,
  disabled,
}: IAppSelectProps) {
  const [search, setSearch] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dataRender = useMemo(() => {
    if (!search) return options;
    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const onHandleChange = (value: string | number) => {
    if (disabled) return;
    setSearch('');
    onValueChange?.(value);
    setIsOpen(false);
  };

  const valueRender = useMemo(() => {
    return options.find((option) => option.value === value)?.label || placeholder;
  }, [options, value, placeholder]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Typography.Caption variant="caption_1_regular" text={label} />
            {isRequired && <span className="text-red">*</span>}
          </div>
        </div>
      )}
      <div className="relative flex w-full" ref={selectRef}>
        <div className="flex w-full flex-col gap-1">
          <div
            className={cn(
              'border-black-10 bg-neutral-0 flex h-12 w-full cursor-pointer justify-between gap-2 rounded-[8px] border px-4 py-3',
              isOpen && 'border-neutral-900',
              error && 'border-red',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onFocus={() => !disabled && setIsOpen(true)}
            tabIndex={0}
          >
            <Typography.Body variant="16_regular" text={valueRender || ''} />
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <Image
                src="/icons/chevron-down.svg"
                alt="chevron-down"
                width={20}
                height={20}
                className="size-4"
              />
            </motion.div>
          </div>
          {error && (
            <Typography.Caption variant="caption_1_regular" text={error} className="text-red" />
          )}
        </div>

        {isOpen && (
          <div className={cn('absolute top-13 z-10 w-full', contentClassName)}>
            <div className="flex max-h-96 min-h-52 flex-col gap-2 rounded-[8px] border border-gray-200 bg-white py-4 shadow-lg">
              <div className="border-black-10 relative flex w-full items-center gap-2 border-b-[0.5px] px-5">
                <Image
                  src="/icons/search.svg"
                  width={24}
                  height={24}
                  className="size-4"
                  alt="search"
                />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full border-0 px-4 py-2"
                  disabled={disabled}
                />
              </div>

              <div className="overflow-y-auto px-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-track]:bg-transparent">
                {dataRender.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      'flex cursor-pointer justify-between px-4 py-[9px] hover:rounded-[8px] hover:bg-gray-100',
                      disabled && 'cursor-not-allowed opacity-50',
                    )}
                    onClick={() => onHandleChange(option.value)}
                  >
                    <Typography.Body variant="16_regular" text={option.label} />
                    {option.value === value && (
                      <Image
                        src="/icons/check.svg"
                        width={24}
                        height={24}
                        className="size-4"
                        alt="checked"
                      />
                    )}
                  </div>
                ))}

                {dataRender.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-4 py-16">
                    <Image
                      src="/icons/search.svg"
                      width={60}
                      height={60}
                      className="size-10"
                      alt="checked"
                    />
                    <Typography.Body variant="16_regular" text="No results" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
