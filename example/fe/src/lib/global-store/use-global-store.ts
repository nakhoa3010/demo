import { useGlobalStore } from './global-atoms';

//custom hook to set get global state
export const useSetGlobalStore = () => {
  const [state, setState] = useGlobalStore();
  return {
    state,
    setState,
  };
};

//custom hook to get global state
export const useGetGlobalStore = () => {
  const [state] = useGlobalStore();
  return state;
};

//get isBlackBackground
export const useGetIsBlackBackground = () => {
  const [state] = useGlobalStore();
  return state.isBlackBackground;
};

//set isBlackBackground with param
//Usage: useSetIsBlackBackground(true)
export const useSetIsBlackBackground = () => {
  const [, setState] = useGlobalStore();

  const onToggleIsBlackBackground = (isBlackBackground: boolean) => {
    setState((prev) => ({ ...prev, isBlackBackground }));
  };

  return { onToggleIsBlackBackground };
};

//get isMobileMenuOpen
export const useGetIsMobileMenuOpen = () => {
  const [state] = useGlobalStore();
  return state.isMobileMenuOpen;
};

//set isMobileMenuOpen with param
//Usage: useSetIsMobileMenuOpen(true)
export const useSetIsMobileMenuOpen = () => {
  const [, setState] = useGlobalStore();

  const onToggleIsMobileMenuOpen = (isMobileMenuOpen: boolean) => {
    setState((prev) => ({ ...prev, isMobileMenuOpen }));
  };

  return { onToggleIsMobileMenuOpen };
};
