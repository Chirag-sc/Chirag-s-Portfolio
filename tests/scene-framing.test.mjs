import test from 'node:test';
import assert from 'node:assert/strict';
import { getSceneFrame, annotationPoint } from '../lib/scene-framing.ts';

test('featured project renews the light after the quieter About composition', () => {
  assert.ok(
    getSceneFrame(0.43, false, false, false).presence >
      getSceneFrame(0.22, false, false, false).presence,
  );
  assert.equal(getSceneFrame(0.58, false, false, false).presence, 0);
  assert.equal(getSceneFrame(1, false, false, false).presence, 0);
});
test('framing is continuous around every journey boundary', () => {
  for (const mobile of [false, true])
    for (const boundary of [0.22, 0.43, 0.58]) {
      const before = getSceneFrame(boundary - 0.00001, mobile, false, false);
      const after = getSceneFrame(boundary + 0.00001, mobile, false, false);
      for (const key of ['x', 'y', 'scale', 'presence'])
        assert.ok(Math.abs(before[key] - after[key]) < 0.0001);
    }
});
test('reduced motion keeps spatial framing fixed for every scroll position', () => {
  for (const mobile of [false, true]) {
    const home = getSceneFrame(0, mobile, true, false);
    for (const progress of [0.1, 0.22, 0.43, 0.58, 1]) {
      const frame = getSceneFrame(progress, mobile, true, false);
      assert.deepEqual(
        [frame.x, frame.y, frame.scale],
        [home.x, home.y, home.scale],
      );
    }
    assert.equal(getSceneFrame(0.22, mobile, true, false).presence, 0);
  }
});
test('inspection framing is independent of page position and motion preference', () => {
  for (const mobile of [false, true]) {
    const frame = getSceneFrame(0, mobile, false, true);
    assert.deepEqual(getSceneFrame(0.9, mobile, true, true), frame);
    assert.equal(frame.presence, 1);
  }
});
test('annotation origin matches the inspection shadow center in both compositions', () => {
  for (const [width, height] of [
    [1440, 1000],
    [390, 844],
  ]) {
    const frame = getSceneFrame(0, width < 650, false, true);
    const point = annotationPoint(0, 0, width, height);
    assert.equal(parseFloat(point.left), frame.x * 100);
    assert.equal(parseFloat(point.top), (1 - frame.y) * 100);
  }
});
