export interface SceneLandmark {
  offset: number;
  progress: number;
}
export interface SceneMotion {
  progress: number;
  x: number;
  y: number;
  time: number;
}

/** Interpolate actual section positions, independent of page length or breakpoint. */
export function sampleJourney(
  scroll: number,
  landmarks: readonly SceneLandmark[],
) {
  if (landmarks.length < 2) return 0;
  for (let i = 1; i < landmarks.length; i++) {
    const before = landmarks[i - 1];
    const after = landmarks[i];
    if (scroll <= after.offset) {
      const t = Math.max(
        0,
        Math.min(
          1,
          (scroll - before.offset) / Math.max(1, after.offset - before.offset),
        ),
      );
      return before.progress + (after.progress - before.progress) * t;
    }
  }
  return landmarks[landmarks.length - 1].progress;
}

/** Reduced effects bypass every spatial/time input, including residual damping. */
export function advanceSceneMotion(
  previous: SceneMotion,
  target: number,
  pointer: { x: number; y: number },
  reduced: boolean,
  delta: number,
): SceneMotion {
  if (reduced) return { progress: 0, x: 0, y: 0, time: previous.time };
  const dt = Math.max(0, Math.min(delta, 0.05));
  const follow = 1 - Math.exp(-4.5 * dt);
  const pointerFollow = 1 - Math.exp(-3.2 * dt);
  return {
    progress:
      previous.progress +
      (Math.max(0, Math.min(1, target)) - previous.progress) * follow,
    x: previous.x + (pointer.x - previous.x) * pointerFollow,
    y: previous.y + (pointer.y - previous.y) * pointerFollow,
    time: previous.time + dt,
  };
}
