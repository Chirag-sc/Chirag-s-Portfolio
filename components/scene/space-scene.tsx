'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { ShaderMaterial, Vector2, NoToneMapping } from 'three';
import { sceneConfig as config } from '@/lib/scene-config';
import { vertexShader, fragmentShader } from './black-hole-shader';
import { getSceneFrame } from '@/lib/scene-framing';
import {
  advanceSceneMotion,
  sampleJourney,
  type SceneLandmark,
  type SceneMotion,
} from '@/lib/scene-motion';

function BlackHole({
  reduced,
  inspecting,
  lensing,
  onReady,
}: {
  reduced: boolean;
  inspecting: boolean;
  lensing: number;
  onReady: () => void;
}) {
  const material = useRef<ShaderMaterial>(null);
  const { size, invalidate, setDpr, gl } = useThree();
  const progress = useRef(0);
  const motion = useRef<SceneMotion>({ progress: 0, x: 0, y: 0, time: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);
  const inspectionMode = useRef(inspecting);
  const remeasure = useRef<() => void>(() => {});
  const diagnosticAt = useRef(0);
  const frameStats = useRef({ count: 0, total: 0, lowered: false });
  const uniforms = useMemo(
    () => ({
      uResolution: { value: new Vector2(1, 1) },
      uCenter: { value: new Vector2(0.91, 0.55) },
      uScale: { value: 2.65 },
      uPresence: { value: 1 },
      uInspection: { value: 0 },
      uStarLens: { value: 1 },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uTravel: { value: 0 },
      uReduced: { value: reduced ? 1 : 0 },
      uPointer: { value: new Vector2() },
      uLensing: { value: config.lensingStrength },
      uTilt: { value: config.diskTilt },
      uSpeed: { value: config.rotationSpeed },
      uExposure: { value: config.exposure },
      uDensity: { value: config.starDensity },
      uBloom: { value: config.bloom },
      uMobile: { value: 0 },
      uQuality: { value: 1 },
    }),
    [],
  );
  useEffect(() => {
    inspectionMode.current = inspecting;
    invalidate();
  }, [inspecting, lensing, invalidate]);
  useEffect(() => {
    if (inspecting) return;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => remeasure.current());
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [inspecting]);
  useEffect(() => {
    setDpr(
      size.width <= 800 || reduced || frameStats.current.lowered
        ? config.mobileDpr
        : Math.min(window.devicePixelRatio, config.maxDpr),
    );
    uniforms.uResolution.value.set(
      size.width * gl.getPixelRatio(),
      size.height * gl.getPixelRatio(),
    );
    uniforms.uMobile.value = size.width <= 800 ? 1 : 0;
    uniforms.uQuality.value = size.width <= 800 || reduced ? 0 : 1;
    invalidate();
  }, [size, uniforms, reduced, gl, invalidate, setDpr]);
  useEffect(() => {
    let landmarks: SceneLandmark[] = [];
    const update = () => {
      if (inspectionMode.current) return;
      progress.current = sampleJourney(window.scrollY, landmarks);
      if (!document.hidden) invalidate();
    };
    const measure = () => {
      if (inspectionMode.current) return;
      const sections = [
        ['about', 0.22],
        ['projects', 0.35],
        ['black-hole-ai', 0.43],
        ['acad-sync', 0.58],
        ['experience', 0.68],
        ['skills', 0.75],
        ['education', 0.82],
        ['certificates', 0.9],
        ['contact', 1],
      ] as const;
      landmarks = [{ offset: 0, progress: 0 }];
      for (const [id, stage] of sections) {
        const element = document.getElementById(id);
        if (element)
          landmarks.push({
            offset: Math.max(
              1,
              element.getBoundingClientRect().top +
                window.scrollY -
                window.innerHeight * 0.18,
            ),
            progress: stage,
          });
      }
      update();
    };
    remeasure.current = measure;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    onReady();
    return () => {
      remeasure.current = () => {};
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', measure);
    };
  }, [invalidate, onReady]);
  useEffect(() => {
    pointer.current = { x: 0, y: 0 };
    if (reduced) {
      invalidate();
      return;
    }
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const move = (event: PointerEvent) => {
      if (
        inspectionMode.current ||
        !fine.matches ||
        event.pointerType !== 'mouse'
      )
        return;
      pointer.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (0.5 - event.clientY / window.innerHeight) * 2,
      };
    };
    const clear = () => {
      if (inspectionMode.current) return;
      pointer.current = { x: 0, y: 0 };
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) clear();
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave, { passive: true });
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('blur', clear);
    };
  }, [reduced, invalidate]);
  useFrame((_, delta) => {
    if (!material.current) return;
    const active = material.current.uniforms;
    if (!initialized.current) {
      motion.current.progress = reduced ? 0 : progress.current;
      initialized.current = true;
    }
    if (!document.hidden && !inspecting)
      motion.current = advanceSceneMotion(
        motion.current,
        progress.current,
        pointer.current,
        reduced,
        delta,
      );
    const state = motion.current;
    const sceneProgress = inspecting
      ? 0
      : reduced
        ? progress.current
        : state.progress;
    const frame = getSceneFrame(
      sceneProgress,
      size.width <= 800,
      reduced,
      inspecting,
    );
    active.uCenter.value.set(frame.x, frame.y);
    active.uScale.value = frame.scale;
    active.uPresence.value = frame.presence;
    active.uInspection.value = inspecting ? 1 : 0;
    active.uStarLens.value = inspecting ? lensing : 1;
    active.uResolution.value.set(
      size.width * gl.getPixelRatio(),
      size.height * gl.getPixelRatio(),
    );
    active.uMobile.value = size.width <= 800 ? 1 : 0;
    active.uScroll.value = sceneProgress;
    active.uTravel.value = inspecting || reduced ? 0 : state.progress;
    active.uReduced.value = reduced ? 1 : 0;
    active.uPointer.value.set(
      inspecting || reduced ? 0 : state.x * config.pointerParallax,
      inspecting || reduced ? 0 : state.y * config.pointerParallax,
    );
    active.uTime.value = state.time;
    active.uQuality.value =
      size.width <= 800 || reduced || frameStats.current.lowered ? 0 : 1;
    // Read-only diagnostics for local browser QA, removed by production build.
    if (
      process.env.NODE_ENV !== 'production' &&
      (reduced || inspecting || performance.now() - diagnosticAt.current > 250)
    ) {
      diagnosticAt.current = performance.now();
      gl.domElement.dataset.motion = JSON.stringify({
        target: progress.current,
        ...state,
        inspecting,
        lensing: active.uStarLens.value,
        frame,
      });
    }
    const stats = frameStats.current;
    if (!reduced && !inspecting && stats.count < 100) {
      stats.count++;
      stats.total += Math.min(delta, 0.1);
      if (
        stats.count === 100 &&
        stats.total / 100 > config.targetFrameMs / 1000 &&
        !stats.lowered
      ) {
        stats.lowered = true;
        setDpr(1);
        active.uQuality.value = 0;
        active.uResolution.value.set(size.width, size.height);
      }
    }
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function SpaceScene({
  reduced,
  inspecting,
  lensing,
  hidden,
  onReady,
  onFail,
}: {
  reduced: boolean;
  inspecting: boolean;
  lensing: number;
  hidden: boolean;
  onReady: () => void;
  onFail: () => void;
}) {
  return (
    <Canvas
      dpr={[1, reduced ? 1 : config.maxDpr]}
      frameloop={reduced || hidden || inspecting ? 'demand' : 'always'}
      orthographic
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'low-power',
        toneMapping: NoToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute('aria-hidden', 'true');
        gl.debug.onShaderError = (context, _program, _vertex, fragment) => {
          console.error(
            'Black hole shader failed:',
            context.getShaderInfoLog(fragment),
          );
          onFail();
        };
        gl.domElement.addEventListener(
          'webglcontextlost',
          (event) => {
            event.preventDefault();
            onFail();
          },
          { once: true },
        );
      }}
      fallback={null}
    >
      <BlackHole
        reduced={reduced}
        inspecting={inspecting}
        lensing={lensing}
        onReady={onReady}
      />
    </Canvas>
  );
}
