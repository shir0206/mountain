import { NodeIO, TextureInfo } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { KHRTextureTransform } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import { readFileSync } from 'fs';
import path from 'path';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const GLB_PATH = 'public/models/pegrola_-_micha.xml.glb';
const DIFFUSE_PATH = 'public/textures/floor/floor_tiles_02_diff_4k.jpg';
const ROUGHNESS_PATH = 'public/textures/floor/floor_tiles_02_rough_4k.jpg';

const doc = await io.read(GLB_PATH);
const root = doc.getRoot();

// Find the "Kostka" material (floor slab)
const kostkaMat = root.listMaterials().find(m => m.getName() === 'Kostka');
if (!kostkaMat) {
  console.error('Material "Kostka" not found!');
  process.exit(1);
}

console.log('Found material "Kostka" — applying floor tile textures...');

// Create textures from the JPG files
const diffuseTexture = doc.createTexture('floor_diffuse')
  .setImage(readFileSync(DIFFUSE_PATH))
  .setMimeType('image/jpeg')
  .setURI('floor_tiles_02_diff_4k.jpg');

const roughnessTexture = doc.createTexture('floor_roughness')
  .setImage(readFileSync(ROUGHNESS_PATH))
  .setMimeType('image/jpeg')
  .setURI('floor_tiles_02_rough_4k.jpg');

// Apply textures to the material
kostkaMat.setBaseColorTexture(diffuseTexture);
kostkaMat.setRoughnessFactor(0.85);
kostkaMat.setMetallicFactor(0.0);
kostkaMat.setMetallicRoughnessTexture(roughnessTexture);

// Apply KHR_texture_transform for 4x4 tiling
const transformExt = doc.createExtension(KHRTextureTransform);

const baseColorInfo = kostkaMat.getBaseColorTextureInfo();
if (baseColorInfo) {
  const transform = transformExt.createTransform()
    .setScale([4, 4]);
  baseColorInfo.setExtension('KHR_texture_transform', transform);
}

const roughnessInfo = kostkaMat.getMetallicRoughnessTextureInfo();
if (roughnessInfo) {
  const transform = transformExt.createTransform()
    .setScale([4, 4]);
  roughnessInfo.setExtension('KHR_texture_transform', transform);
}

// Set base color to white (so texture shows at full brightness)
kostkaMat.setBaseColorFactor([1, 1, 1, 1]);

await io.write(GLB_PATH, doc);
console.log(`Done! Updated ${GLB_PATH} with baked floor tile textures (4x4 tiling).`);