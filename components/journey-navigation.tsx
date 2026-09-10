'use client';
import { useEffect, useRef, useState } from 'react';

const sections = [
  'About',
  'Projects',
  'Experience',
  'Skills',
  'Education',
  'Certificates',
  'Contact',
];

export default function JourneyNavigation({
  open,
  paused,
  onClose,
}: {
  open: boolean;
  paused: boolean;
  onClose: () => void;
}) {
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState('');
  const [marker, setMarker] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    if (paused) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const readingLine = Math.min(window.innerHeight * 0.3, 240);
      let current = '';
      for (const section of sections) {
        const id = section.toLowerCase();
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= readingLine)
          current = id;
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4
      )
        current = 'contact';
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [paused]);

  useEffect(() => {
    let disposed = false;
    const place = () => {
      if (disposed || !nav.current) return;
      const link = nav.current.querySelector<HTMLAnchorElement>(
        '[aria-current="location"]',
      );
      if (!link || !nav.current.getClientRects().length) {
        setMarker((previous) => ({ ...previous, visible: false }));
        return;
      }
      const bounds = nav.current.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      const mobile = window.matchMedia('(max-width: 800px)').matches;
      setMarker({
        x: mobile
          ? rect.left - bounds.left - 13
          : rect.left - bounds.left + rect.width * 0.5 - 2.5,
        y: mobile
          ? rect.top - bounds.top + rect.height * 0.5 - 2.5
          : rect.bottom - bounds.top - 3,
        visible: true,
      });
    };
    place();
    const observer = new ResizeObserver(place);
    if (nav.current) observer.observe(nav.current);
    window.addEventListener('resize', place);
    void document.fonts.ready.then(place);
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [active, open]);

  return (
    <nav
      ref={nav}
      id="main-navigation"
      className={open ? 'menu-open' : ''}
      aria-label="Main navigation"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          onClose();
          document
            .querySelector<HTMLButtonElement>('.mobile-menu-button')
            ?.focus();
        }
      }}
    >
      <span
        className="nav-orbit-marker"
        aria-hidden="true"
        style={{
          transform: `translate(${marker.x}px, ${marker.y}px)`,
          opacity: marker.visible ? 1 : 0,
        }}
      />
      {sections.map((label) => (
        <a
          key={label}
          href={`#${label.toLowerCase()}`}
          aria-current={active === label.toLowerCase() ? 'location' : undefined}
          onClick={onClose}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
