import { atom, useAtom } from 'jotai';

interface InitialState {
  isBlackBackground: boolean;
  isMobileMenuOpen: boolean;
}

const globalState = atom<InitialState>({
  isBlackBackground: false,
  isMobileMenuOpen: false,
});

export const useGlobalStore = () => useAtom(globalState);
