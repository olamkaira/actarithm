import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CalculatorDisplayProps {
  equation: string;
  display: string;
}

export function CalculatorDisplay({ equation, display }: CalculatorDisplayProps) {
  const displayRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (displayRef.current) {
      const container = displayRef.current.parentElement;
      if (!container) return;

      const containerWidth = container.offsetWidth - 48; // Padding'i çıkar
      const textWidth = displayRef.current.scrollWidth;
      
      if (textWidth > containerWidth) {
        setScale(containerWidth / textWidth);
      } else {
        setScale(1);
      }
    }
  }, [display]);

  return (
    <motion.div 
      className="mb-6 flex flex-col items-end rounded-xl bg-background/50 p-6 overflow-hidden"
      animate={{ scale: display === '' ? 0.98 : 1 }}
      transition={{ duration: 0.1 }}
    >
      <motion.div 
        className="text-base text-muted-foreground font-medium truncate w-full text-right"
        animate={{ opacity: equation ? 1 : 0.7 }}
      >
        {equation}
      </motion.div>
      <motion.div 
        ref={displayRef}
        className="text-4xl font-bold text-foreground mt-1 origin-right"
        style={{ 
          transform: `scale(${scale})`,
          width: scale === 1 ? 'auto' : '100%',
          transformOrigin: 'right'
        }}
        key={display}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {display}
      </motion.div>
    </motion.div>
  );
} 