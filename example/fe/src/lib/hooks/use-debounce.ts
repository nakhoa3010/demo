import { useCallback, useRef } from 'react';
//to use this hook, you can do like this:
// const debouncedCheckPagName = useDebounce(checkPagNameAsync, 1000);
// debouncedCheckPagName("your-domain");

export default function useDebounce(fn: (...args: never[]) => never, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: never[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay],
  );
}
