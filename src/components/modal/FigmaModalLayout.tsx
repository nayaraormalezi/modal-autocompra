import type { ReactNode } from 'react';
import styles from './FigmaModalLayout.module.css';

interface FigmaModalButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  autoFocus?: boolean;
}

export interface FigmaModalLayoutProps {
  title: string;
  description: string;
  titleId: string;
  descriptionId: string;
  illustrationSrc?: string;
  illustrationAlt?: string;
  secondaryButton: FigmaModalButton;
  primaryButton: FigmaModalButton;
  children?: ReactNode;
}

export function FigmaModalLayout({
  title,
  description,
  titleId,
  descriptionId,
  illustrationSrc = '/assets/illustration-family.svg',
  illustrationAlt = '',
  secondaryButton,
  primaryButton,
  children,
}: FigmaModalLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.illustrationWrapper}>
        <img
          src={illustrationSrc}
          alt={illustrationAlt}
          className={styles.illustration}
          aria-hidden={illustrationAlt === '' ? true : undefined}
        />
      </div>

      <div className={styles.titleWrapper}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
      </div>

      <div className={styles.descriptionWrapper}>
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      </div>

      {children}

      <div className={styles.actions}>
        <div className={styles.buttonMargin}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={secondaryButton.onClick}
            autoFocus={secondaryButton.autoFocus}
          >
            {secondaryButton.label}
          </button>
        </div>
        <div className={styles.buttonMargin}>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={primaryButton.onClick}
            autoFocus={primaryButton.autoFocus}
          >
            {primaryButton.label}
          </button>
        </div>
      </div>
    </div>
  );
}
