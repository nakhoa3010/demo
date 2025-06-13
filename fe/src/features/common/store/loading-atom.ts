import { atom, useAtom } from 'jotai';

export const loadingModalAtom = atom({
  isOpen: false,
  message: 'Please wait a moment...',
});

export const useLoadingModal = () => {
  const [, setLoadingModal] = useAtom(loadingModalAtom);

  const showLoading = (message: string = 'Please wait a moment...') => {
    setLoadingModal({ isOpen: true, message });
  };

  const hideLoading = () => {
    setLoadingModal({ isOpen: false, message: 'Please wait a moment...' });
  };

  return { showLoading, hideLoading };
};
