import { useId } from 'react';
import { AccessibleModal } from './AccessibleModal';
import { FigmaModalLayout } from './FigmaModalLayout';
import { buildRecoveryTitle } from '@/lib/getFirstName';

interface JourneyRecoveryModalProps {
  open: boolean;
  onContinue: () => void;
  onStartOver: () => void;
  firstName?: string;
}

export function JourneyRecoveryModal({
  open,
  onContinue,
  onStartOver,
  firstName,
}: JourneyRecoveryModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <AccessibleModal
      open={open}
      labelledBy={titleId}
      describedBy={descriptionId}
    >
      <FigmaModalLayout
        titleId={titleId}
        descriptionId={descriptionId}
        title={buildRecoveryTitle(firstName)}
        description="Encontramos informações do seu consórcio que você começou anteriormente. Deseja continuar de onde parou?"
        secondaryButton={{
          label: 'Começar novamente',
          onClick: onStartOver,
        }}
        primaryButton={{
          label: 'Continuar de onde parei',
          onClick: onContinue,
          autoFocus: true,
        }}
      />
    </AccessibleModal>
  );
}
