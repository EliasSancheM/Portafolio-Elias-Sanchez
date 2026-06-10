/**
 * Genera los modelos 3D del portafolio de forma procedural y los exporta
 * como .glb comprimido con Draco (pipeline equivalente a Blender → glTF + Draco).
 *
 * Uso:  node tools/generate-models.mjs
 * Requiere (instalación one-time, no entra al bundle):
 *   npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf
 *
 * Salida: public/models/esm-core.glb
 *   Nodos: Crystal (gema facetada), Ring1, Ring2 (anillos orbitales),
 *          Shards (grupo de 8 fragmentos flotantes Shard0..Shard7)
 */
import { Document, NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { IcosahedronGeometry, OctahedronGeometry, TorusGeometry } from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { mkdirSync } from 'node:fs';

// PRNG con semilla para que el modelo sea reproducible
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Geometrías (three.js solo como motor de mallas) ─────────────

function buildCrystal() {
  const rand = mulberry32(20260610);
  let geo = new IcosahedronGeometry(1, 2);
  // PolyhedronGeometry duplica vértices por cara: soldarlos para desplazar sin grietas
  geo = mergeVertices(geo, 1e-4);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const len = Math.hypot(x, y, z) || 1;
    const d = 1 + (rand() - 0.5) * 0.28; // facetas irregulares
    pos.setXYZ(i, (x / len) * d, (y / len) * d * 1.55, (z / len) * d); // alargado en Y = gema
  }
  geo = geo.toNonIndexed(); // de vuelta a caras independientes → sombreado plano
  geo.computeVertexNormals();
  return geo;
}

function buildRing(radius, tube) {
  return new TorusGeometry(radius, tube, 12, 160);
}

function buildShard(scale, rand) {
  const geo = new OctahedronGeometry(1, 0).toNonIndexed();
  const pos = geo.attributes.position;
  const sx = scale * (0.6 + rand() * 0.5);
  const sy = scale * (1.2 + rand() * 1.1); // alargados
  const sz = scale * (0.6 + rand() * 0.5);
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(i, pos.getX(i) * sx, pos.getY(i) * sy, pos.getZ(i) * sz);
  }
  geo.computeVertexNormals();
  return geo;
}

// ── Exportación glTF ─────────────────────────────────────────────

const doc = new Document();
doc.createBuffer();
const scene = doc.createScene('ESMCore');
doc.getRoot().setDefaultScene(scene);

function addPrimitive(geo, material) {
  const prim = doc.createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(geo.attributes.position.array)))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(geo.attributes.normal.array)))
    .setMaterial(material);
  if (geo.index) {
    prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(geo.index.array)));
  }
  return prim;
}

const matCrystal = doc.createMaterial('CrystalMat')
  .setBaseColorFactor([0.49, 0.36, 0.99, 1])
  .setMetallicFactor(0.1).setRoughnessFactor(0.15);

const matRing = doc.createMaterial('RingMat')
  .setBaseColorFactor([0.02, 0.05, 0.08, 1])
  .setMetallicFactor(1).setRoughnessFactor(0.25)
  .setEmissiveFactor([0, 0.9, 0.76]); // teal neón

const matShard = doc.createMaterial('ShardMat')
  .setBaseColorFactor([0.3, 0.2, 0.8, 1])
  .setMetallicFactor(0.4).setRoughnessFactor(0.3)
  .setEmissiveFactor([0.45, 0.3, 1]); // violeta neón

// Cristal central
scene.addChild(doc.createNode('Crystal').setMesh(doc.createMesh('Crystal').addPrimitive(addPrimitive(buildCrystal(), matCrystal))));

// Anillos orbitales
scene.addChild(doc.createNode('Ring1').setMesh(doc.createMesh('Ring1').addPrimitive(addPrimitive(buildRing(2.1, 0.022), matRing))));
scene.addChild(doc.createNode('Ring2').setMesh(doc.createMesh('Ring2').addPrimitive(addPrimitive(buildRing(2.65, 0.014), matRing))));

// Fragmentos flotantes alrededor
const shards = doc.createNode('Shards');
const rand = mulberry32(777);
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2 + rand() * 0.6;
  const r = 2.2 + rand() * 1.2;
  const node = doc.createNode(`Shard${i}`)
    .setMesh(doc.createMesh(`Shard${i}`).addPrimitive(addPrimitive(buildShard(0.12 + rand() * 0.08, rand), matShard)))
    .setTranslation([Math.cos(angle) * r, (rand() - 0.5) * 2.4, Math.sin(angle) * r])
    .setRotation([rand() * 0.5, rand(), rand() * 0.5, 1]);
  shards.addChild(node);
}
scene.addChild(shards);

// Compresión Draco + escritura
const io = new NodeIO()
  .registerExtensions([KHRDracoMeshCompression])
  .registerDependencies({
    'draco3d.encoder': await draco3d.createEncoderModule(),
    'draco3d.decoder': await draco3d.createDecoderModule(),
  });

await doc.transform(draco({ method: 'edgebreaker' }));
mkdirSync('public/models', { recursive: true });
await io.write('public/models/esm-core.glb', doc);
console.log('✔ public/models/esm-core.glb generado (Draco)');
