'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { ShaderMaterial, Vector2, NoToneMapping } from 'three';
import { sceneConfig as config } from '@/lib/scene-config';
import { vertexShader, fragmentShader } from './black-hole-shader';

function BlackHole({
  reduced,
  onReady,
}: {
  reduced: boolean;
  onReady: () => void;
}) {
  const material = useRef<ShaderMaterial>(null);
  const { size, invalidate, setDpr, gl } = useThree();
  const progress = useRef(0);
  const frameStats = useRef({ count: 0, total: 0, lowered: false });
  const uniforms = useMemo(
    () => ({
      uResolution: { value: new Vector2(1, 1) },
      uTime: { value: 0 },
      uScroll: { value: 0 },
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
    setDpr(
      size.width < 650 || reduced || frameStats.current.lowered
        ? config.mobileDpr
        : Math.min(window.devicePixelRatio, config.maxDpr),
    );
    uniforms.uResolution.value.set(
      size.width * gl.getPixelRatio(),
      size.height * gl.getPixelRatio(),
    );
    uniforms.uMobile.value = size.width < 650 ? 1 : 0;
    uniforms.uQuality.value = size.width < 650 || reduced ? 0 : 1;
    invalidate();
  }, [size, uniforms, reduced, gl, invalidate, setDpr]);
  useEffect(() => {
    const update = () => {
      progress.current = Math.min(window.scrollY / window.innerHeight, 1.2);
      uniforms.uScroll.value = progress.current;
      invalidate();
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    onReady();
    return () => window.removeEventListener('scroll', update);
  }, [invalidate, uniforms, onReady]);
  useFrame((_, delta) => {
    if (!material.current) return;
    const active = material.current.uniforms;
    active.uResolution.value.set(
      size.width * gl.getPixelRatio(),
      size.height * gl.getPixelRatio(),
    );
    active.uMobile.value = size.width < 650 ? 1 : 0;
    active.uScroll.value = progress.current;
    active.uQuality.value =
      size.width < 650 || reduced || frameStats.current.lowered ? 0 : 1;
    if (!reduced && !document.hidden)
      active.uTime.value += Math.min(delta, 0.05);
    const stats = frameStats.current;
    if (!reduced && stats.count < 100) {
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
  hidden,
  onReady,
  onFail,
}: {
  reduced: boolean;
  hidden: boolean;
  onReady: () => void;
  onFail: () => void;
}) {
  return (
    <Canvas
      dpr={[1, reduced ? 1 : config.maxDpr]}
      frameloop={reduced || hidden ? 'demand' : 'always'}
      orthographic
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'low-power',
        toneMapping: NoToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute('aria-hidden', 'true');
        gl.debug.onShaderError = onFail;
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
      <BlackHole reduced={reduced} onReady={onReady} />
    </Canvas>
  );
}
