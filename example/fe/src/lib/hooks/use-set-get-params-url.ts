import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function useSetGetParamsUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const onSetParam = (name: string, value: string | number) => {
    if (value) {
      current.set(name, value.toString());
    } else {
      current.delete(name);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const onGetParam = (name: string) => {
    return searchParams.get(name);
  };

  return {
    onSetParam,
    onGetParam,
  };
}

export function useGetQuerystring<T = Record<string, string>>(): Partial<T> {
  const searchParams = useSearchParams();
  const queryObject = {} as Partial<T>;

  for (const [key, value] of searchParams.entries()) {
    (queryObject as Record<string, unknown>)[key] = value;
  }

  return queryObject;
}
