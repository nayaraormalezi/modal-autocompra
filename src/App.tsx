import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  JourneyRecoveryModal,
  JourneyRestartConfirmModal,
} from '@/components/modal';
import { useJourneyRecovery, createJourneyHelpers } from '@/hooks/useJourneyRecovery';
import { getFirstName } from '@/lib/getFirstName';
import { journeyStorage } from '@/lib/journeyStorage';
import '@/styles/index.css';
import styles from './App.module.css';

const DEMO_JOURNEY_ID = 'demo-autocompra-001';
const TOTAL_STEPS = 5;

function AutocompraDemo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  const helpers = createJourneyHelpers(DEMO_JOURNEY_ID);

  const {
    showRecoveryModal,
    showRestartConfirm,
    savedJourney,
    handleContinue,
    handleStartOverRequest,
    handleRestartConfirm,
    handleRestartCancel,
  } = useJourneyRecovery({
    totalSteps: TOTAL_STEPS,
    onContinue: (journey) => {
      setCurrentStep(journey.currentStep);
      setFormData((journey.data as Record<string, string>) ?? {});
      setInitialized(true);
    },
    onRestart: () => {
      setCurrentStep(1);
      setFormData({});
      setInitialized(true);
    },
  });

  useEffect(() => {
    if (!showRecoveryModal && !showRestartConfirm && !initialized) {
      setInitialized(true);
    }
  }, [showRecoveryModal, showRestartConfirm, initialized]);

  const handleFieldChange = (field: string, value: string) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);
    helpers.saveProgress(currentStep, nextData);
  };

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      helpers.saveProgress(nextStep, formData);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      helpers.saveProgress(prevStep, formData);
    }
  };

  const seedDemoJourney = () => {
    journeyStorage.saveJourney({
      journeyId: DEMO_JOURNEY_ID,
      currentStep: 3,
      data: {
        nome: 'Maria Silva',
        email: 'maria@email.com',
        valor: '150000',
      },
    });
    window.location.reload();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Autocompra de Consórcio</h1>
        <p className={styles.pageSubtitle}>
          Demonstração do modal de recuperação de jornada
        </p>
      </header>

      {initialized && (
        <main className={styles.main}>
          <div className={styles.stepIndicator}>
            Etapa {currentStep} de {TOTAL_STEPS}
          </div>

          <div className={styles.form}>
            <label className={styles.label}>
              Nome completo
              <input
                type="text"
                className={styles.input}
                value={formData.nome ?? ''}
                onChange={(e) => handleFieldChange('nome', e.target.value)}
                placeholder="Digite seu nome"
              />
            </label>

            <label className={styles.label}>
              E-mail
              <input
                type="email"
                className={styles.input}
                value={formData.email ?? ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="Digite seu e-mail"
              />
            </label>

            <label className={styles.label}>
              Valor do crédito
              <input
                type="text"
                className={styles.input}
                value={formData.valor ?? ''}
                onChange={(e) => handleFieldChange('valor', e.target.value)}
                placeholder="R$ 0,00"
              />
            </label>
          </div>

          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navButton}
              onClick={handlePrevStep}
              disabled={currentStep === 1}
            >
              Voltar
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navButtonPrimary}`}
              onClick={handleNextStep}
              disabled={currentStep === TOTAL_STEPS}
            >
              Próxima etapa
            </button>
          </div>

          <div className={styles.demoActions}>
            <button type="button" className={styles.demoButton} onClick={seedDemoJourney}>
              Simular jornada abandonada (etapa 3)
            </button>
            <button
              type="button"
              className={styles.demoButton}
              onClick={() => {
                journeyStorage.clearJourney();
                window.location.reload();
              }}
            >
              Limpar jornada
            </button>
          </div>

          {savedJourney && (
            <p className={styles.debug}>
              Jornada detectada: etapa {savedJourney.currentStep}
            </p>
          )}
        </main>
      )}

      <JourneyRecoveryModal
        open={showRecoveryModal}
        onContinue={handleContinue}
        onStartOver={handleStartOverRequest}
        firstName={getFirstName(savedJourney?.data)}
      />

      <JourneyRestartConfirmModal
        open={showRestartConfirm}
        onConfirm={handleRestartConfirm}
        onBack={handleRestartCancel}
      />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AutocompraDemo />
  </StrictMode>,
);
