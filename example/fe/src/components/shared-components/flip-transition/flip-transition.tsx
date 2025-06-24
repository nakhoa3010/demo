'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlipTransitionProps {
  children: React.ReactNode;
}

export default function FlipTransition({ children }: FlipTransitionProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState<number>(0);

  const sections = [
    { id: 0, bg: '#000' },
    { id: 1, bg: '#FFF' },
  ];

  const stripCount = 30;
  const strips = Array.from({ length: stripCount }, (_, i) => i);

  useEffect(() => {
    const updateHeight = () => {
      if (sectionRef.current) {
        const height = sectionRef.current.getBoundingClientRect().height;
        setSectionHeight(height);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, [children]);

  useEffect(() => {
    // Create IntersectionObserver to detect when element enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When element enters viewport, trigger animation by setting currentSection to 1
          if (entry.isIntersecting) {
            setCurrentSection(1);
          } else {
            setCurrentSection(0);
          }
        });
      },
      { threshold: 0.1 }, // Trigger when 10% of the element is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => setIsTransitioning(false), 1000);
    return () => clearTimeout(timeout);
  }, [currentSection]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: sections[currentSection].bg,
        height: sectionHeight ? `${sectionHeight}px` : 'auto',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            position: 'sticky',
            top: 0,
            width: '100%',
            height: sectionHeight ? `${sectionHeight}px` : 'auto',
            background: sections[currentSection].bg,
            zIndex: 1,
          }}
        >
          <div ref={sectionRef}>{children}</div>
        </motion.div>
      </AnimatePresence>
      {isTransitioning && sectionHeight > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${sectionHeight}px`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          {strips.map((strip) => {
            const delay = (strip / stripCount) * 0.5;

            return (
              <motion.div
                key={strip}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 90 }}
                transition={{
                  duration: 0.5,
                  delay,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: `${(strip / stripCount) * 100}%`,
                  width: '100%',
                  height: `${100 / stripCount}%`,
                  background: currentSection === 0 ? sections[1].bg : sections[0].bg,
                  transformOrigin: 'top',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
