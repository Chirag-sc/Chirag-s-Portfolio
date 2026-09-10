export interface SceneFrame {
  x: number;
  y: number;
  scale: number;
  presence: number;
}

const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** Art-directed framing, shared by the renderer and its HTML annotations. */
export function getSceneFrame(
  progress: number,
  mobile: boolean,
  reduced: boolean,
  inspecting: boolean,
): SceneFrame {
  const hero = mobile
    ? { x: 0.58, y: 0.79, scale: 4.55, presence: 1 }
    : { x: 0.91, y: 0.55, scale: 2.65, presence: 1 };
  if (inspecting)
    return {
      x: 0.5,
      y: mobile ? 0.64 : 0.53,
      scale: mobile ? 4.8 : 3.25,
      presence: 1,
    };
  if (reduced)
    return { ...hero, presence: 1 - smooth((progress - 0.015) / 0.205) };
  const frames: [number, SceneFrame][] = [
    [0, hero],
    [
      0.22,
      {
        x: 0.88,
        y: mobile ? 0.88 : 0.8,
        scale: mobile ? 9.5 : 6.2,
        presence: 0.26,
      },
    ],
    [
      0.43,
      {
        x: mobile ? 0.75 : 0.84,
        y: mobile ? 0.89 : 0.81,
        scale: mobile ? 9 : 5.7,
        presence: 0.58,
      },
    ],
    [0.58, { x: 0.9, y: 0.92, scale: 10, presence: 0 }],
    [1, { x: 0.9, y: 0.92, scale: 10, presence: 0 }],
  ];
  const p = Math.max(0, Math.min(1, progress));
  for (let i = 1; i < frames.length; i++) {
    const [start, a] = frames[i - 1];
    const [end, b] = frames[i];
    if (p <= end) {
      const t = smooth((p - start) / (end - start));
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        scale: a.scale + (b.scale - a.scale) * t,
        presence: a.presence + (b.presence - a.presence) * t,
      };
    }
  }
  return frames[frames.length - 1][1];
}

/** Convert the same shader-plane coordinates to viewport percentages. */
export function annotationPoint(
  px: number,
  py: number,
  width: number,
  height: number,
) {
  const frame = getSceneFrame(0, width <= 800, false, true);
  return {
    left: `${(frame.x + px / ((width / height) * frame.scale)) * 100}%`,
    top: `${(1 - frame.y - py / frame.scale) * 100}%`,
  };
}
