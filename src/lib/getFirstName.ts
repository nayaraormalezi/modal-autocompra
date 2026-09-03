import type { JourneyData } from '@/types/journey';

function formatFirstName(value: string): string | undefined {
  const first = value.trim().split(/\s+/)[0];
  if (!first) return undefined;

  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function getFirstName(data?: JourneyData | null): string | undefined {
  if (!data) return undefined;

  const raw = data.nome ?? data.firstName ?? data.primeiroNome ?? data.name;
  if (typeof raw !== 'string') return undefined;

  return formatFirstName(raw);
}

export function buildRecoveryTitle(firstName?: string): string {
  if (firstName) {
    return `${firstName}, você já começou a simular seu consórcio.`;
  }

  return 'Você já começou a simular seu consórcio.';
}
