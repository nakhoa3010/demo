import { toast } from 'sonner';

interface ToastCustomOptions {
  duration?: number;
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  description?: string | React.ReactNode;
}

export default function useToast() {
  const defaultOptions: ToastCustomOptions = {
    duration: 3000,
    position: 'bottom-center',
  };

  const toastSuccess = (message: string, options?: ToastCustomOptions) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
    });
  };

  const toastError = (message: string, options?: ToastCustomOptions) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
    });
  };

  const toastWarning = (message: string, options?: ToastCustomOptions) => {
    toast.warning(message, {
      ...defaultOptions,
      ...options,
    });
  };

  const toastInfo = (message: string, options?: ToastCustomOptions) => {
    toast.info(message, {
      ...defaultOptions,
      ...options,
    });
  };

  const toastCustom = (message: string, options?: ToastCustomOptions) => {
    toast(message, {
      ...defaultOptions,
      ...options,
    });
  };

  return { toastSuccess, toastError, toastWarning, toastInfo, toastCustom };
}
