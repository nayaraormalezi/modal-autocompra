import {
  JOURNEY_COOKIE_NAME,
  JOURNEY_MAX_AGE_DAYS,
  JOURNEY_STORAGE_VERSION,
  type SavedJourney,
} from '@/types/journey';

const MAX_AGE_SECONDS = JOURNEY_MAX_AGE_DAYS * 24 * 60 * 60;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  if (!match) return null;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (!isBrowser()) return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function isValidJourney(payload: unknown): payload is SavedJourney {
  if (!payload || typeof payload !== 'object') return false;

  const journey = payload as Partial<SavedJourney>;

  return (
    typeof journey.journeyId === 'string' &&
    journey.journeyId.length > 0 &&
    typeof journey.currentStep === 'number' &&
    Number.isFinite(journey.currentStep) &&
    journey.currentStep >= 1 &&
    typeof journey.data === 'object' &&
    journey.data !== null &&
    typeof journey.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(journey.updatedAt)) &&
    journey.version === JOURNEY_STORAGE_VERSION
  );
}

function isExpired(journey: SavedJourney): boolean {
  const updatedAt = new Date(journey.updatedAt).getTime();
  const maxAgeMs = JOURNEY_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - updatedAt > maxAgeMs;
}

function readRaw(): SavedJourney | null {
  const raw = getCookie(JOURNEY_COOKIE_NAME);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isValidJourney(parsed)) return null;
    if (isExpired(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const journeyStorage = {
  hasSavedJourney(): boolean {
    return readRaw() !== null;
  },

  getSavedJourney(): SavedJourney | null {
    return readRaw();
  },

  saveJourney(journey: Omit<SavedJourney, 'updatedAt' | 'version'> & Partial<Pick<SavedJourney, 'updatedAt' | 'version'>>): SavedJourney {
    const payload: SavedJourney = {
      journeyId: journey.journeyId,
      currentStep: journey.currentStep,
      data: journey.data,
      updatedAt: journey.updatedAt ?? new Date().toISOString(),
      version: JOURNEY_STORAGE_VERSION,
    };

    setCookie(JOURNEY_COOKIE_NAME, JSON.stringify(payload), MAX_AGE_SECONDS);
    return payload;
  },

  clearJourney(): void {
    deleteCookie(JOURNEY_COOKIE_NAME);
  },

  getLastStep(): number | null {
    const journey = readRaw();
    return journey?.currentStep ?? null;
  },

  invalidateIfCorrupt(): boolean {
    const raw = getCookie(JOURNEY_COOKIE_NAME);
    if (!raw) return false;

    const journey = readRaw();
    if (!journey) {
      deleteCookie(JOURNEY_COOKIE_NAME);
      return true;
    }

    return false;
  },
};
