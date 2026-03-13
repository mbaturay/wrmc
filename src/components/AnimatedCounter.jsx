import { useState, useEffect, useRef } from 'react';

export function AnimatedCounter({ value, prefix = '$', duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else prevValue.current = end;
    }
    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <span className="counter-animate" aria-live="polite">
      {prefix}{display.toFixed(2)}
    </span>
  );
}
