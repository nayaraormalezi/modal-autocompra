import { useCallback, useEffect, useState } from 'react';
import { journeyStorage } from '@/lib/journeyStorage';
import type { JourneyData, SavedJourney } from '@/types/journey';

export interface UseJourneyRecoveryOptions {
  /** Total de etapas da jornada (para validação) */
  totalSteps?: number;
  /** Callback ao continuar jornada salva */
  onContinue?: (journey: SavedJourney) => void;
  /** Callback ao reiniciar jornada */
  onRestart?: () => void;
  /** Se false, não verifica jornada salva automaticamente */
  autoCheck?: boolean;
}

export interface UseJourneyRecoveryReturn {
  showRecoveryModal: boolean;
  showRestartConfirm: boolean;
  savedJourney: SavedJourney | null;
  handleContinue: () => void;
  handleStartOverRequest: () => void;
  handleRestartConfirm: () => void;
  handleRestartCancel: () => void;
}

export function useJourneyRecovery(
  options: UseJourneyRecoveryOptions = {},
): UseJourneyRecoveryReturn {
  const { totalSteps, onContinue, onRestart, autoCheck = true } = options;

  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [savedJourney, setSavedJourney] = useState<SavedJourney | null>(null);

  useEffect(() => {
    if (!autoCheck) return;

    const wasInvalid = journeyStorage.invalidateIfCorrupt();
    if (wasInvalid) return;

    const journey = journeyStorage.getSavedJourney();
    if (!journey) return;

    if (totalSteps && journey.currentStep > totalSteps) {
      journeyStorage.clearJourney();
      return;
    }

    setSavedJourney(journey);
    setShowRecoveryModal(true);
  }, [autoCheck, totalSteps]);

  const handleContinue = useCallback(() => {
    if (!savedJourney) return;

    setShowRecoveryModal(false);
    onContinue?.(savedJourney);
  }, [savedJourney, onContinue]);

  const handleStartOverRequest = useCallback(() => {
    setShowRecoveryModal(false);
    setShowRestartConfirm(true);
  }, []);

  const handleRestartConfirm = useCallback(() => {
    journeyStorage.clearJourney();
    setSavedJourney(null);
    setShowRestartConfirm(false);
    onRestart?.();
  }, [onRestart]);

  const handleRestartCancel = useCallback(() => {
    setShowRestartConfirm(false);
    setShowRecoveryModal(true);
  }, []);

  return {
    showRecoveryModal,
    showRestartConfirm,
    savedJourney,
    handleContinue,
    handleStartOverRequest,
    handleRestartConfirm,
    handleRestartCancel,
  };
}

/** Utilitário para integração com formulários da jornada */
export function createJourneyHelpers(journeyId: string) {
  return {
    saveProgress(currentStep: number, data: JourneyData) {
      return journeyStorage.saveJourney({ journeyId, currentStep, data });
    },

    updateStep(currentStep: number) {
      const existing = journeyStorage.getSavedJourney();
      if (!existing) return null;

      return journeyStorage.saveJourney({
        ...existing,
        currentStep,
      });
    },
  };
}
