import { useCallback, useEffect, useRef, useState } from 'react';

const closeDelay = 180;
const transitionDuration = 180;

// Constant memory: two timers and local state per sidebar instance.
export default function useHoverReveal({
  enabled,
  onActivate,
  onDeactivate,
}: {
  enabled: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
}) {
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const [hoverClosing, setHoverClosing] = useState(false);
  const expandedRef = useRef(false);
  const closingRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const clearTimers = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = undefined;
    }
  }, []);

  const open = useCallback(() => {
    if (!enabled) return;
    clearTimers();
    if (closingRef.current) {
      closingRef.current = false;
      setHoverClosing(false);
    }
    if (expandedRef.current) {
      setHoverExpanded(true);
      return;
    }

    expandedRef.current = true;
    setHoverExpanded(true);
    onActivate?.();
  }, [clearTimers, enabled, onActivate]);

  const scheduleClose = useCallback(() => {
    if (!enabled || !expandedRef.current || closingRef.current) return;
    clearTimers();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = undefined;
      setHoverExpanded(false);
      closingRef.current = true;
      setHoverClosing(true);
      transitionTimerRef.current = setTimeout(() => {
        transitionTimerRef.current = undefined;
        expandedRef.current = false;
        closingRef.current = false;
        setHoverClosing(false);
        onDeactivate?.();
      }, transitionDuration);
    }, closeDelay);
  }, [clearTimers, enabled, onDeactivate]);

  useEffect(() => {
    if (enabled) return;
    clearTimers();
    expandedRef.current = false;
    closingRef.current = false;
    setHoverExpanded(false);
    setHoverClosing(false);
  }, [clearTimers, enabled]);

  useEffect(() => clearTimers, [clearTimers]);

  return { hoverExpanded, hoverClosing, open, scheduleClose };
}
