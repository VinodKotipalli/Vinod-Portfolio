import React from 'react';
import { motion, Variants } from 'framer-motion';

export interface MaskedHeadingProps {
  /** The text string to animate */
  text: string;
  /** HTML tag to render, defaults to 'h2' */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div' | React.ElementType;
  /** Additional CSS classes for styling */
  className?: string;
  /** Split strategy: 'words' (recommended for 60fps performance) or 'characters' */
  splitBy?: 'characters' | 'words';
  /** Initial delay before starting the animation in seconds */
  delay?: number;
  /** Stagger time between consecutive items in seconds */
  staggerDelay?: number;
  /** Duration of each item's transition in seconds */
  duration?: number;
  /** Viewport amount required to trigger */
  viewportAmount?: number | 'some';
  /** Optional custom id for the heading element */
  id?: string;
}

export const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  text,
  as = 'h2',
  className = '',
  splitBy = 'words',
  delay = 0.05,
  staggerDelay,
  duration = 0.5,
  viewportAmount = 'some',
  id,
}) => {
  const Component: React.ElementType = as;
  const words = text.trim().split(/\s+/);
  const stepStagger = staggerDelay ?? (splitBy === 'characters' ? 0.02 : 0.06);

  const itemVariants: Variants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: (customIndex: number) => ({
      y: '0%',
      opacity: 1,
      transition: {
        duration,
        delay: delay + customIndex * stepStagger,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  let globalCharIndex = 0;

  return (
    <Component id={id} className={className} aria-label={text}>
      {/* Screen-reader accessible full text */}
      <span className="sr-only">{text}</span>

      {/* Visual staggered masked presentation */}
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: viewportAmount, margin: '0px 0px 40px 0px' }}
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
                      className="inline-block"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      {char}
                    </motion.span>
                  );
                })
              ) : (
                <motion.span
                  custom={wordIdx}
                  variants={itemVariants}
                  className="inline-block"
                  style={{ willChange: 'transform, opacity' }}
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
