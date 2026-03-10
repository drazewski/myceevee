import { useEffect, useRef, useState } from 'react';

export function useFitText(displayText: string, active: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const fit = () => {
      const available = el.clientWidth;
      if (!available) return;

      // Always compute relative to the parent's font-size so our scaling
      // doesn't affect the baseline measurement.
      const baseSize = parseFloat(getComputedStyle(parent).fontSize);
      const style = getComputedStyle(el);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${baseSize}px ${style.fontFamily}`;
      const naturalWidth = ctx.measureText(displayText).width;

      if (naturalWidth <= available) {
        setFontSize(undefined);
        return;
      }

      const ratio = available / naturalWidth;
      const newSize = Math.max(baseSize * 0.6, baseSize * ratio);
      setFontSize(`${newSize}px`);
    };

    // Observe the PARENT so resizing the sidebar triggers re-measurement
    // without creating a feedback loop on the element we're scaling.
    const observer = new ResizeObserver(fit);
    observer.observe(parent);
    fit();

    return () => observer.disconnect();
  }, [active, displayText]);

  return { ref, fontSize };
}
