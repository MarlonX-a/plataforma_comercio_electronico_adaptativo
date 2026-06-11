import type { HTMLAttributes, ReactNode } from 'react';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type CardElement = 'div' | 'section' | 'article' | 'aside';
export type CardVariant = 'default' | 'interactive' | 'outlined';

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: CardElement;
  variant?: CardVariant;
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: ReactNode;
};

export default function Card({
  as: Element = 'div',
  variant = 'default',
  padding = 'medium',
  className,
  children,
  ...cardProps
}: CardProps) {
  return (
    <Element
      {...cardProps}
      className={joinClassNames(
        styles.card,
        styles[`card${variant[0].toUpperCase()}${variant.slice(1)}`],
        styles[`padding${padding[0].toUpperCase()}${padding.slice(1)}`],
        className,
      )}
    >
      {children}
    </Element>
  );
}
