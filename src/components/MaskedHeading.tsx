import React from 'react';
import { motion, Variants } from 'framer-motion';

export interface MaskedHeadingProps {
  /** The text string to animate */
  text: string;
  /** HTML tag to render, defaults to 'h2' */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div' | React.ElementType;
  /** Additional CSS classes for styling */
  className?: string;
  /** Split strategy: 'characters' gives smooth wave across letters; 'words' animates word by word */
  splitBy?: 'characters' | 'words';
  /** Initial delay before starting the animation in seconds */
  delay?: number;
  /** Stagger time between consecutive items in seconds */
  staggerDelay?: number;
  /** Duration of each item's transition in seconds */
  duration?: number;
  /** Starting blur radius in pixels (default: 12) */
  initialBlur?: number;
  /** Viewport amount required to trigger (default: 0.25) */
  viewportAmount?: number;
  /** Optional custom id for the heading element */
  id?: string;
}

export const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  text,
  as = 'h2',
  className = '',
  splitBy = 'characters',
  delay = 0.1,
  staggerDelay,
  duration = 0.7,
  initialBlur = 12,
  viewportAmount = 0.25,
  id,
}) => {
  const Component: React.ElementType = as;
  const words = text.trim().split(/\s+/);
  const stepStagger = staggerDelay ?? (splitBy === 'characters' ? 0.026 : 0.08);

  const itemVariants: Variants = {
    hidden: {
      y: '120%',
      opacity: 0,
      filter: `blur(${initialBlur}px)`,
      scale: 0.95,
    },
    visible: (customIndex: number) => ({
      y: '0%',
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration,
        delay: delay + customIndex * stepStagger,
        ease: [0.16, 1, 0.3, 1], // Cinematic cubic-bezier for snappy, sharp focus
      },
    }),
  };

  let globalCharIndex = 0;

  return (
    <Component id={id} className={className} aria-label={text}>
      {/* Screen-reader accessible full text */}
      <span className="sr-only">{text}</span>

      {/* Visual staggered masked blurred-to-sharp presentation */}
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: viewportAmount }}
        className="inline-block max-w-full"
      >
        {words.map((word, wordIdx) => {
          return (
            <span
              key={wordIdx}
              className="inline-block whitespace-nowrap overflow-hidden align-top mr-[0.28em] last:mr-0 pt-[0.05em] pb-[0.12em] -mt-[0.05em] -mb-[0.12em]"
            >
              {splitBy === 'characters' ? (
                word.split('').map((char, charIdx) => {
                  const currentIndex = globalCharIndex++;
                  return (
                    <motion.span
                      key={charIdx}
                      custom={currentIndex}
                      variants={itemVariants}
                      className="inline-block will-change-[transform,filter,opacity]"
                    >
                      {char}
                    </motion.span>
                  );
                })
              ) : (
                <motion.span
                  custom={wordIdx}
                  variants={itemVariants}
                  className="inline-block will-change-[transform,filter,opacity]"
                >
                  {word}
                </motion.span>
              )}
            </span>
          );
        })}
      </motion.span>
    </Component>
  );
};

export default MaskedHeading;
