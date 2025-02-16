'use client';

import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LottieAnimationProps {
  animationData: any; // Type for Lottie JSON data
  width?: string | number;
  height?: string | number;
  loop?: boolean;
  autoplay?: boolean;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  width = '100%',
  height = '100%',
  loop = true,
  autoplay = true,
  onComplete,
  onLoopComplete,
  className,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData
      });

      // Event listeners
      if (onComplete) {
        animationRef.current.addEventListener('complete', onComplete);
      }
      if (onLoopComplete) {
        animationRef.current.addEventListener('loopComplete', onLoopComplete);
      }
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        if (onComplete) {
          animationRef.current.removeEventListener('complete', onComplete);
        }
        if (onLoopComplete) {
          animationRef.current.removeEventListener(
            'loopComplete',
            onLoopComplete
          );
        }
        animationRef.current.destroy();
      }
    };
  }, [animationData, loop, autoplay, onComplete, onLoopComplete]);

  const containerStyle: React.CSSProperties = {
    width,
    height,
    ...style
  };

  return (
    <div ref={containerRef} style={containerStyle} className={className} />
  );
};

export default LottieAnimation;
