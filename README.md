# Modal de Recuperação — Autocompra de Consórcio

Implementação fiel ao design do Figma para o modal de recuperação de jornada da Autocompra de Consórcio.

## Estrutura

```
src/
├── components/modal/
│   ├── AccessibleModal.tsx          # Overlay + dialog acessível
│   ├── FigmaModalLayout.tsx         # Layout visual fiel ao Figma
│   ├── JourneyRecoveryModal.tsx     # Modal principal de recuperação
│   └── JourneyRestartConfirmModal.tsx # Confirmação de reinício
├── hooks/
│   ├── useJourneyRecovery.ts        # Orquestração dos fluxos
│   └── useModalAccessibility.ts     # Focus trap, ESC, scroll lock
├── lib/
│   └── journeyStorage.ts            # Camada isolada de persistência
└── types/
    └── journey.ts                     # Tipos da jornada
```

## Integração

```tsx
import {
  JourneyRecoveryModal,
  JourneyRestartConfirmModal,
} from '@/components/modal';
import { useJourneyRecovery } from '@/hooks/useJourneyRecovery';

function AutocompraPage() {
  const {
    showRecoveryModal,
    showRestartConfirm,
    handleContinue,
    handleStartOverRequest,
    handleRestartConfirm,
    handleRestartCancel,
  } = useJourneyRecovery({
    totalSteps: 5,
    onContinue: (journey) => {
      // Navegar para journey.currentStep com journey.data
    },
    onRestart: () => {
      // Iniciar jornada limpa na etapa 1
    },
  });

  return (
    <>
      {/* Sua jornada */}
      <JourneyRecoveryModal
        open={showRecoveryModal}
        onContinue={handleContinue}
        onStartOver={handleStartOverRequest}
      />
      <JourneyRestartConfirmModal
        open={showRestartConfirm}
        onConfirm={handleRestartConfirm}
        onBack={handleRestartCancel}
      />
    </>
  );
}
```

## Persistência

A camada `journeyStorage` expõe:

- `hasSavedJourney()` — verifica se existe jornada válida
- `getSavedJourney()` — retorna a jornada salva
- `saveJourney()` — persiste progresso
- `clearJourney()` — remove jornada
- `getLastStep()` — retorna última etapa válida
- `invalidateIfCorrupt()` — limpa jornadas inválidas/expiradas

## Desenvolvimento

```bash
npm install
npm run dev
```

## Referência visual

Figma: [Modal Container (node 0:735)](https://www.figma.com/design/RFA3481cueuUn5Wxw4ftgD/Untitled?node-id=0-735)
