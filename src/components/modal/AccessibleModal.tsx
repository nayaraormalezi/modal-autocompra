import type { ReactNode } from 'react';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import styles from './AccessibleModal.module.css';

interface AccessibleModalProps {
  open: boolean;
  onClose?: () => void;
  labelledBy: string;
  describedBy: string;
  children: ReactNode;
}

export function AccessibleModal({
  open,
  onClose,
  labelledBy,
  describedBy,
  children,
}: AccessibleModalProps) {
  const containerRef = useModalAccessibility(open, onClose);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
