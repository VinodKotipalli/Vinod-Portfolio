import React, { ElementType } from 'react';
import { motion, Variants } from 'framer-motion';

export type StaggerDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  viewportAmount?: number | 'some' | 'all';
  viewportMargin?: string;
  once?: boolean;
  as?: ElementType;
  id?: string;
}

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
  direction?: StaggerDirection;
  customDistance?: number;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  onClick?: () => void;
  id?: string;
}

// Reusable Framer Motion Variants for Staggered Parent Containers
export const createStaggerContainerVariants = (
  staggerDelay = 0.08,
  delayChildren = 0.05
): Variants => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: delayChildren,
    },
  },
});

export const defaultStaggerContainerVariants = createStaggerContainerVariants(0.08, 0.05);

// Reusable Framer Motion Variants for Staggered Child Items (Cards, Grid Cells, List Items)
export const createStaggerItemVariants = (
  direction: StaggerDirection = 'up',
  distance = 28
): Variants => {
  const getInitialCoords = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
        return { x: 0, y: 0 };
    }
  };

  const coords = getInitialCoords();

  return {
    hidden: {
      opacity: 0,
      filter: 'blur(6px)',
      scale: 0.97,
      ...coords,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1], // Cubic-bezier for smooth deceleration
      },
    },
  };
};

export const defaultStaggerItemVariants = createStaggerItemVariants('up', 28);
export const listStaggerItemVariants = createStaggerItemVariants('right', 20);

/**
 * StaggerContainer orchestrates child entrances sequentially via an Intersection Observer.
 * When the container enters the viewport, it triggers each child with a calculated stagger delay.
 */
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.08,
  delayChildren = 0.05,
  viewportAmount = 0.15,
  viewportMargin = '0px 0px -40px 0px',
  once = true,
  as: Component = 'div',
  id,
}) => {
  const MotionComponent = motion(Component as ElementType);
  const variants = createStaggerContainerVariants(staggerDelay, delayChildren);

  return (
    <MotionComponent
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: viewportAmount, margin: viewportMargin }}
      variants={variants}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * StaggerItem represents an individual item (card, list item, badge) within a StaggerContainer.
 * Inherits the parent container's sequence timing and enters with a blurred-to-sharp fluid slide.
 */
export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  as: Component = 'div',
  direction = 'up' as StaggerDirection,
  customDistance = 28,
  whileHover,
  whileTap,
  onClick,
  id,
}) => {
  const MotionComponent = motion(Component as ElementType);
  const variants = createStaggerItemVariants(direction, customDistance);

  return (
    <MotionComponent
      id={id}
      variants={variants}
      whileHover={whileHover}
      whileTap={whileTap}
      onClick={onClick}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export default StaggerContainer;
