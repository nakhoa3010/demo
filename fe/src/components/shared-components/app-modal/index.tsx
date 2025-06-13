import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Typography from '../typography';
import { cn } from '@/lib/utils';

interface AppModalProps {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  open: boolean;
  className?: string;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
}

export default function AppModal({
  onClose,
  children,
  title,
  open,
  className,
  hideHeader,
  hideCloseButton,
}: AppModalProps) {
  return (
    <Dialog modal={true} open={open}>
      <DialogContent
        className={cn(
          'min-h-screen max-w-[460px] rounded-[0px] px-6 pt-10 pb-6 shadow-none lg:min-h-0 lg:rounded-[12px] lg:shadow-lg',
          className,
        )}
        hideCloseButton={hideCloseButton}
        onClose={onClose}
      >
        <VisuallyHidden>
          <DialogTitle className="text-[32px] lg:text-[28px]">{title}</DialogTitle>
        </VisuallyHidden>

        <div className="flex flex-1 flex-col gap-6">
          {!hideHeader && <Typography.Headline text={title} className="mb-8 lg:text-center" />}
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
