import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  useGLTF,
  Float,
  Sparkles,
  Stars,
  Environment,
  MeshTransmissionMaterial,
  AdaptiveDpr,
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { scrollState } from '../../lib/scroll.js';

const MODEL_URL = '/models/esm-core.glb';

function CoreModel() {
  const { nodes } = useGLTF(MODEL_URL);
  const group = useRef();
  const crystal = useRef();
  const ring1 = useRef();
  const ring2 = useRef();

  const ringMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#04141a',
    metalness: 1,
    roughness: 0.25,
    emissive: '#00e5c3',
    emissiveIntensity: 2.4,
  }), []);

  const shardMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4d33cc',
    metalness: 0.4,
    roughness: 0.3,
    emissive: '#7c5cfc',
    emissiveIntensity: 1.6,
  }), []);

  const shards = useMemo(() => (nodes.Shards ? nodes.Shards.children : []), [nodes]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;

    if (group.current) {
      // Coreografía de scroll: el núcleo se hace a un lado y se aleja al bajar
      const targetX = Math.sin(p * Math.PI * 2) * 3.1;
      const targetY = -0.5 - Math.sin(p * Math.PI) * 0.5;
      const targetZ = -1.4 - p * 2.6;
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 2.5, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 2.5, delta);
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 2.5, delta);
      group.current.rotation.y = t * 0.12 + p * Math.PI * 3;
    }
    if (crystal.current) {
      crystal.current.rotation.y = t * 0.25;
      crystal.current.position.y = Math.sin(t * 0.8) * 0.12;
    }
    if (ring1.current) {
      ring1.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.3) * 0.18;
      ring1.current.rotation.z = t * 0.4;
    }
    if (ring2.current) {
      ring2.current.rotation.x = Math.PI / 1.7 + Math.cos(t * 0.25) * 0.2;
      ring2.current.rotation.z = -t * 0.28;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, -1.4]} scale={0.72}>
      {/* Cristal central: vidrio con dispersión */}
      <mesh ref={crystal} geometry={nodes.Crystal.geometry} castShadow>
        <MeshTransmissionMaterial
          backside
          samples={6}
          resolution={384}
          transmission={1}
          thickness={1.4}
          ior={1.45}
          chromaticAberration={0.35}
          anisotropy={0.2}
          distortion={0.25}
          distortionScale={0.4}
          temporalDistortion={0.1}
          color="#a78bff"
          emissive="#2a1670"
          emissiveIntensity={0.35}
          attenuationColor="#7c5cfc"
          attenuationDistance={2.2}
        />
      </mesh>

      {/* Anillos orbitales neón */}
      <mesh ref={ring1} geometry={nodes.Ring1.geometry} material={ringMat} />
      <mesh ref={ring2} geometry={nodes.Ring2.geometry} material={ringMat} />

      {/* Fragmentos flotantes */}
      {shards.map((shard, i) => (
        <Float key={shard.name} speed={1.5 + (i % 3) * 0.6} rotationIntensity={1.4} floatIntensity={1.8}>
          <mesh
            geometry={shard.geometry}
            material={shardMat}
            position={shard.position}
            quaternion={shard.quaternion}
          />
        </Float>
      ))}
    </group>
  );
}

function CameraRig() {
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.7, 2.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.4, 2.2, delta);
    camera.lookAt(0, -0.2, 0);
  });
  return null;
}

export default function Experience() {
  return (
    <>
      <color attach="background" args={['#06060e']} />
      <fog attach="fog" args={['#06060e', 9, 24]} />

      <ambientLight intensity={0.25} />
      <pointLight position={[6, 4, 6]} intensity={40} color="#7c5cfc" />
      <pointLight position={[-6, -3, 4]} intensity={30} color="#00e5c3" />
      <directionalLight position={[0, 6, 3]} intensity={0.8} color="#ffffff" />

      <CoreModel />
      <CameraRig />

      <Sparkles count={130} scale={14} size={2.2} speed={0.3} opacity={0.55} color="#9b7bff" />
      <Sparkles count={60} scale={10} size={1.6} speed={0.2} opacity={0.4} color="#00e5c3" />
      <Stars radius={70} depth={40} count={2800} factor={3.2} saturation={0.4} fade speed={0.5} />

      <Environment preset="city" resolution={64} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={1.15} luminanceThreshold={0.2} luminanceSmoothing={0.25} mipmapBlur />
        <ChromaticAberration offset={[0.0011, 0.0007]} />
        <Vignette eskil={false} offset={0.18} darkness={0.82} />
        <Noise opacity={0.035} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </>
  );
}

useGLTF.preload(MODEL_URL);
