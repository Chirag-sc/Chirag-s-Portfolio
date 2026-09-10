'use client';
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
const SpaceScene = lazy(() => import('./space-scene'));
class SceneBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function SpaceBackground({
  reduced,
  inspecting,
  lensing,
  onAvailabilityChange,
}: {
  reduced: boolean;
  inspecting: boolean;
  lensing: number;
  onAvailabilityChange: (value: boolean) => void;
}) {
  const backdrop = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(false);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  useEffect(
    () => onAvailabilityChange(ready && supported && !failed),
    [ready, supported, failed, onAvailabilityChange],
  );
  useEffect(() => {
    const fade = () =>
      backdrop.current?.style.setProperty(
        '--fallback-opacity',
        String(Math.max(0, 1 - window.scrollY / window.innerHeight)),
      );
    fade();
    window.addEventListener('scroll', fade, { passive: true });
    return () => window.removeEventListener('scroll', fade);
  }, []);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('scene') === 'static')
      return;
    try {
      const test = document.createElement('canvas');
      const context = test.getContext('webgl2');
      setSupported(!!context);
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      setSupported(false);
    }
    const update = () => setHidden(document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return (
    <div
      ref={backdrop}
      className={`space-background ${ready ? 'scene-ready' : ''} ${inspecting ? 'inspection-scene' : ''}`}
      aria-hidden="true"
      data-scene={failed || !supported ? 'static' : ready ? 'webgl' : 'loading'}
    >
      <div className="static-stars" />
      {supported && !failed && (
        <SceneBoundary onFail={onFail}>
          <Suspense fallback={null}>
            <SpaceScene
              reduced={reduced}
              inspecting={inspecting}
              lensing={lensing}
              hidden={hidden}
              onReady={onReady}
              onFail={onFail}
            />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
