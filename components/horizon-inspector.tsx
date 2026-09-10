'use client';
import { useEffect, useRef, useState } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { ArrowUpRight, X } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Slider } from '@base-ui/react/slider';
import { annotationPoint } from '@/lib/scene-framing';

export default function HorizonInspector({
  open,
  onOpenChange,
  lensing,
  onLensingChange,
  available,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  lensing: number;
  onLensingChange: (value: number) => void;
  available: boolean;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 1440, height: 1000 });
  const lensRadius = Math.sqrt(Math.max(0.1, available ? lensing : 1));
  useEffect(() => {
    const measure = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const changeOpen = (value: boolean) => {
    if (value) position.current = { x: window.scrollX, y: window.scrollY };
    onOpenChange(value);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={changeOpen}
      onOpenChangeComplete={(value) => {
        if (!value) {
          window.scrollTo({
            left: position.current.x,
            top: position.current.y,
            behavior: 'instant',
          });
          trigger.current?.focus({ preventScroll: true });
        }
      }}
    >
      <DialogTrigger ref={trigger} className="inspect-trigger">
        <span className="inspect-symbol" aria-hidden="true">
          ◎
        </span>
        <span>Inspect the horizon</span>
        <ArrowUpRight size={16} />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="horizon-backdrop" />
        <DialogPrimitive.Popup
          className="horizon-inspector"
          initialFocus={close}
          finalFocus={false}
        >
          <div className="inspector-header">
            <div>
              <p className="eyebrow">A CLOSER LOOK / EVENT HORIZON</p>
              <DialogTitle>At the edge of the knowable.</DialogTitle>
              <DialogDescription>
                An artistic study of light around a black hole.
              </DialogDescription>
            </div>
            <DialogClose ref={close} className="inspector-close">
              <span>Close</span>
              <X size={20} />
            </DialogClose>
          </div>
          <div className="horizon-annotations" aria-label="Scene annotations">
            <div
              className="horizon-annotation annotation-shadow"
              style={annotationPoint(
                0.16,
                0.1,
                viewport.width,
                viewport.height,
              )}
            >
              <i />
              <span>01 / Black hole shadow</span>
            </div>
            <div
              className="horizon-annotation annotation-disk"
              style={annotationPoint(
                0.91,
                -0.19,
                viewport.width,
                viewport.height,
              )}
            >
              <i />
              <span>02 / Accretion disk</span>
            </div>
            <div
              className="horizon-annotation annotation-lens"
              style={annotationPoint(
                -0.59 * lensRadius,
                0.4 * lensRadius,
                viewport.width,
                viewport.height,
              )}
            >
              <i />
              <span>
                {available && lensing === 0
                  ? '03 / Background light · unbent'
                  : '03 / Lensed background light'}
              </span>
            </div>
          </div>
          <div className="inspector-panel">
            <div className="inspector-explanation">
              <span className="eyebrow">FOLLOW THE LIGHT</span>
              <p aria-live="polite">
                {available
                  ? 'Move the control. Watch the cool starlight bend around the dark center.'
                  : 'You’re viewing a still captured from this scene. Interactive lensing needs WebGL.'}
              </p>
            </div>
            <div className="lensing-control">
              <div className="lensing-label">
                <label id="lensing-label">Visual lensing strength</label>
                <output>
                  {!available
                    ? 'Still view'
                    : lensing === 0
                      ? 'Off'
                      : lensing < 0.8
                        ? 'Subtle'
                        : lensing <= 1.3
                          ? 'Balanced'
                          : 'Pronounced'}
                </output>
              </div>
              <Slider.Root
                value={available ? lensing : 1}
                min={0}
                max={2}
                step={0.05}
                onValueChange={onLensingChange}
                disabled={!available}
                className="horizon-slider"
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                  </Slider.Track>
                  <Slider.Thumb
                    getAriaLabel={() => 'Visual lensing strength'}
                    getAriaValueText={(_formatted, value) =>
                      value === 0
                        ? 'Off'
                        : `${Math.round((value / 2) * 100)} percent visual effect`
                    }
                  />
                </Slider.Control>
              </Slider.Root>
              <div className="lensing-scale">
                <span>Unbent</span>
                <span>More pronounced</span>
              </div>
            </div>
            <p className="inspector-footnote">
              Illustrative geometry. No calibrated physical measurements.
            </p>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
