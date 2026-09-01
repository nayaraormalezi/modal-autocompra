export const JOURNEY_STORAGE_VERSION = '1.0' as const;
export const JOURNEY_COOKIE_NAME = 'autocompra_journey';
export const JOURNEY_MAX_AGE_DAYS = 30;

export interface JourneyData {
  [key: string]: unknown;
}

export interface SavedJourney {
  journeyId: string;
  currentStep: number;
  data: JourneyData;
  updatedAt: string;
  version: typeof JOURNEY_STORAGE_VERSION;
}

export type JourneyRecoveryResult =
  | { action: 'continue'; journey: SavedJourney }
  | { action: 'restart' }
  | { action: 'none' };

export interface JourneyRecoveryState {
  showRecoveryModal: boolean;
  showRestartConfirm: boolean;
  savedJourney: SavedJourney | null;
}
