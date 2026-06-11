import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styles from './FeatureStackAnimation.module.css';

export type FeatureStackFeature = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  accent: 'cyan' | 'purple';
};

export type FeatureStackAnimationProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  description: string;
  features: readonly FeatureStackFeature[];
  action: ReactNode;
};

const shouldReduceMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  document.documentElement.dataset.motion === 'reduced';

export default function FeatureStackAnimation({
  eyebrow,
  title,
  titleId,
  description,
  features,
  action,
}: FeatureStackAnimationProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMotionReduced, setIsMotionReduced] = useState(shouldReduceMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setIsMotionReduced(shouldReduceMotion());
    const documentObserver = new MutationObserver(updateMotionPreference);

    mediaQuery.addEventListener('change', updateMotionPreference);
    documentObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
    });

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
      documentObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isMotionReduced || isPaused || features.length < 2) {
      return;
    }

    const rotationTimer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % features.length);
    }, 2800);

    return () => window.clearInterval(rotationTimer);
  }, [features.length, isMotionReduced, isPaused]);

  return (
    <div
      className={styles.layout}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className={styles.content}>
        <header className={styles.intro}>
          <p>{eyebrow}</p>
          <h2 id={titleId}>{title}</h2>
          <p>{description}</p>
        </header>

        <div className={styles.featureList} aria-label="Características de la experiencia">
          {features.map((feature, featureIndex) => {
            const isActive = featureIndex === activeIndex;

            return (
              <button
                key={feature.id}
                className={styles.feature}
                type="button"
                data-active={isActive}
                data-accent={feature.accent}
                aria-pressed={isActive}
                onMouseEnter={() => setActiveIndex(featureIndex)}
                onFocus={() => setActiveIndex(featureIndex)}
                onClick={() => setActiveIndex(featureIndex)}
              >
                <span className={styles.featureIcon} aria-hidden="true">
                  {feature.icon}
                </span>
                <span>
                  <strong>{feature.title}</strong>
                  <span>{feature.description}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.action}>{action}</div>
      </div>

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.floorGrid} />
        <div className={styles.signalLine} />
        <div className={styles.stack}>
          {features.map((feature, featureIndex) => (
            <div
              key={feature.id}
              className={styles.block}
              data-active={featureIndex === activeIndex}
              data-accent={feature.accent}
              style={{ '--block-index': featureIndex } as CSSProperties}
            >
              <span className={styles.blockTop}>
                <i />
              </span>
              <span className={styles.blockLeft}>
                <i />
              </span>
              <span className={styles.blockRight}>
                <i />
              </span>
              <span className={styles.blockCore} />
            </div>
          ))}
        </div>
        <div className={styles.platform}>
          <span />
        </div>
      </div>
    </div>
  );
}
