import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceSceneMotion, sampleJourney } from '../lib/scene-motion.ts';

test('native scroll maps variable section positions across the entire journey', () => {
  const points = [
    { offset: 0, progress: 0 },
    { offset: 800, progress: 0.22 },
    { offset: 1600, progress: 0.43 },
    { offset: 5800, progress: 1 },
  ];
  assert.equal(sampleJourney(-20, points), 0);
  assert.equal(sampleJourney(800, points), 0.22);
  assert.equal(sampleJourney(1200, points), 0.325);
  assert.equal(sampleJourney(9999, points), 1);
  assert.ok(sampleJourney(3200, points) > 0.43);
});
test('irregular, duplicate, and missing measurements stay finite', () => {
  assert.equal(sampleJourney(50, []), 0);
  assert.ok(
    Number.isFinite(
      sampleJourney(0, [
        { offset: 0, progress: 0 },
        { offset: 0, progress: 0.22 },
      ]),
    ),
  );
});
test('reduced effects disable residual camera motion, parallax, and time', () => {
  const state = { progress: 0.4, x: 0.8, y: -0.6, time: 12 };
  const reduced = advanceSceneMotion(state, 0.95, { x: -1, y: 1 }, true, 1);
  assert.deepEqual(reduced, { progress: 0, x: 0, y: 0, time: 12 });
  assert.deepEqual(
    advanceSceneMotion(reduced, 0.1, { x: 1, y: -1 }, true, 30),
    reduced,
  );
});
test('large scroll jumps interpolate without overshoot and converge', () => {
  let state = { progress: 0, x: 0, y: 0, time: 0 };
  state = advanceSceneMotion(state, 1, { x: 1, y: -1 }, false, 1 / 60);
  assert.ok(state.progress > 0 && state.progress < 0.1);
  for (let i = 0; i < 240; i++)
    state = advanceSceneMotion(state, 1, { x: 1, y: -1 }, false, 1 / 60);
  assert.ok(state.progress > 0.999 && state.progress <= 1);
  assert.ok(state.x <= 1 && state.y >= -1);
});
test('hidden-tab return cannot inject an unbounded time step', () => {
  const state = advanceSceneMotion(
    { progress: 0, x: 0, y: 0, time: 8 },
    1,
    { x: 0, y: 0 },
    false,
    100,
  );
  assert.equal(state.time, 8.05);
  assert.ok(state.progress < 0.25);
});
