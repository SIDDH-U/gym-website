import { useEffect, useState, useRef } from 'react';
import { getPerformanceTier, subscribePerformanceTier } from '../utils/perfTier';

export default function FpsMeter() {
  const [enabled, setEnabled] = useState(false);
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.6);
  const [tier, setTier] = useState(getPerformanceTier());
  const [activeSection, setActiveSection] = useState('hero');
  const [droppedCount, setDroppedCount] = useState(0);

  const fpsRef = useRef(60);
  const frameTimeRef = useRef(16.6);
  const droppedRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('fps') === '1') {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const unsubscribeTier = subscribePerformanceTier(setTier);

    let frameCount = 0;
    let lastTime = performance.now();
    let lastSecond = performance.now();
    let rAFId = null;

    const sections = ['hero', 'programs', 'stats', 'transformations', 'trainers', 'pricing', 'contact'];

    const getVisibleSection = () => {
      const midY = window.innerHeight / 2;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= midY && rect.bottom >= midY) {
            return id;
          }
        }
      }
      return 'hero';
    };

    const loop = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      if (delta > 0) {
        frameTimeRef.current = delta;

        // Detect frame drop (>32ms = 2 dropped frames at 60fps)
        if (delta > 32) {
          droppedRef.current++;
          setDroppedCount(droppedRef.current);
          const currentSec = getVisibleSection();
          console.warn(
            `[IRONFORGE PERF] ⚠️ Frame spike: ${delta.toFixed(1)}ms (>32ms) | Section: #${currentSec} | Tier: ${getPerformanceTier()}`
          );
        }
      }

      frameCount++;

      if (now - lastSecond >= 500) {
        const measuredFps = Math.round((frameCount * 1000) / (now - lastSecond));
        fpsRef.current = measuredFps;
        setFps(measuredFps);
        setFrameTime(Number(frameTimeRef.current.toFixed(1)));
        setActiveSection(getVisibleSection());
        frameCount = 0;
        lastSecond = now;
      }

      rAFId = requestAnimationFrame(loop);
    };

    rAFId = requestAnimationFrame(loop);

    return () => {
      if (rAFId) cancelAnimationFrame(rAFId);
      unsubscribeTier();
    };
  }, [enabled]);

  if (!enabled) return null;

  const fpsColor = fps >= 57 ? 'text-emerald-400' : fps >= 45 ? 'text-amber-400' : 'text-rose-500';

  return (
    <aside
      aria-label="Performance monitor overlay"
      className="fixed bottom-16 left-3 z-50 p-2.5 rounded-lg bg-black/90 border border-[#2B2F33] text-xs font-mono select-none shadow-2xl pointer-events-none backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] uppercase font-bold text-[#8E9398]">PERF MONITOR</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-xl font-bold font-heading tracking-wider ${fpsColor}`}>
          {fps} <span className="text-xs font-mono font-normal">FPS</span>
        </span>
        <span className="text-[#8E9398] text-[11px]">{frameTime}ms</span>
      </div>
      <div className="mt-1 pt-1 border-t border-[#2B2F33]/60 flex flex-col gap-0.5 text-[10px] text-[#C9CCCF]">
        <div>
          TIER: <span className={`font-bold ${tier === 'high' ? 'text-[#E8590C]' : 'text-amber-400'}`}>{tier.toUpperCase()}</span>
        </div>
        <div>
          SECTION: <span className="text-white font-bold">#{activeSection}</span>
        </div>
        <div>
          SPIKES (&gt;32ms): <span className={droppedCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{droppedCount}</span>
        </div>
      </div>
    </aside>
  );
}
