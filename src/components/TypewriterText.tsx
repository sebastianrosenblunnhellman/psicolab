'use client';

import { useEffect, useState, useRef } from 'react';

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetween?: number;
}

export default function TypewriterText({
  texts,
  className = '',
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetween = 2000,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const animate = () => {
      const currentText = texts[textIndex];
      
      if (isWaiting) {
        timeoutRef.current = setTimeout(() => {
          setIsWaiting(false);
          setIsDeleting(true);
        }, delayBetween);
        return;
      }

      if (isDeleting) {
        if (displayText === '') {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        } else {
          setDisplayText(prev => prev.slice(0, -1));
        }
        timeoutRef.current = setTimeout(animate, deletingSpeed);
      } else {
        if (displayText === currentText) {
          setIsWaiting(true);
        } else {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }
        timeoutRef.current = setTimeout(animate, typingSpeed);
      }
    };

    timeoutRef.current = setTimeout(animate, typingSpeed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, isDeleting, isWaiting, textIndex, texts, typingSpeed, deletingSpeed, delayBetween]);

  if (!texts || texts.length === 0) {
    return null;
  }

  return (
    <span className={className}>
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  );
}
