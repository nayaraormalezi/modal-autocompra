import { useId } from 'react';
import { AccessibleModal } from './AccessibleModal';
import { FigmaModalLayout } from './FigmaModalLayout';

interface JourneyRestartConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

export function JourneyRestartConfirmModal({
  open,
  onConfirm,
  onBack,
}: JourneyRestartConfirmModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <AccessibleModal
      open={open}
      onClose={onBack}
      labelledBy={titleId}
      describedBy={descriptionId}
    >
      <FigmaModalLayout
        titleId={titleId}
        descriptionId={descriptionId}
        title="Começar novamente?"
        description="Suas informações anteriores serão descartadas e você começará uma nova proposta."
        secondaryButton={{
          label: 'Voltar',
          onClick: onBack,
        }}
        primaryButton={{
          label: 'Começar novamente',
          onClick: onConfirm,
          autoFocus: true,
        }}
      />
    </AccessibleModal>
  );
}
