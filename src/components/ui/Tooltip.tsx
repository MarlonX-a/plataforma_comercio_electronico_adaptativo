import { cloneElement, useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import styles from './UiComponents.module.css';

type TooltipTriggerProps = {
  'aria-describedby'?: string;
};

export type TooltipProps = {
  content: ReactNode;
  children: ReactElement<TooltipTriggerProps>;
  position?: 'top' | 'bottom';
};

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const tooltipId = useId();
  const existingDescription = children.props['aria-describedby'];
  const describedBy = [existingDescription, tooltipId].filter(Boolean).join(' ');

  return (
    <span className={styles.tooltipWrapper}>
      {cloneElement(children, { 'aria-describedby': describedBy })}
      <span
        id={tooltipId}
        className={`${styles.tooltip} ${styles[`tooltip${position[0].toUpperCase()}${position.slice(1)}`]}`}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
