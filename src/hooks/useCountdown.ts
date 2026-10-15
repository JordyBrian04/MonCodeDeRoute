import { useEffect, useRef, useState } from 'react';

/**
 * Compte à rebours en secondes basé sur l'horloge (pas de dérive).
 * `running` suspend/reprend. Appelle onEnd une seule fois à 0.
 */
export function useCountdown(totalSec: number | undefined, running: boolean, onEnd: () => void) {
  const [left, setLeft] = useState<number | undefined>(totalSec);
  const endAt = useRef<number | null>(null);
  const cb = useRef(onEnd);
  cb.current = onEnd;
  const fired = useRef(false);

  useEffect(() => {
    if (totalSec == null || !running) {
      endAt.current = null;
      return;
    }
    const remaining = left ?? totalSec;
    endAt.current = Date.now() + remaining * 1000;
    const id = setInterval(() => {
      if (endAt.current == null) return;
      const l = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(l);
      if (l <= 0 && !fired.current) {
        fired.current = true;
        clearInterval(id);
        cb.current();
      }
    }, 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSec, running]);

  return left;
}

/** Chronomètre croissant (durée écoulée en secondes). */
export function useStopwatch(running: boolean) {
  const [sec, setSec] = useState(0);
  const start = useRef<number>(Date.now());
  const acc = useRef(0);
  useEffect(() => {
    if (!running) return;
    start.current = Date.now();
    const id = setInterval(() => setSec(acc.current + (Date.now() - start.current) / 1000), 500);
    return () => {
      acc.current += (Date.now() - start.current) / 1000;
      clearInterval(id);
    };
  }, [running]);
  return sec;
}
