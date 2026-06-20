import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

// sRGB hex → linear float
function srgbToLinear(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  // sRGB → linear approximation (gamma 2.2)
  return [r ** 2.2, g ** 2.2, b ** 2.2];
}

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const doc = await io.read('public/models_optimized/harvey_swivel_chair_mineral_blue.glb');

// Match portal ring: color="#c9a97d" metalness=0.6 roughness=0.15 emissive="#8a6530" emissiveIntensity=0.2
const baseColor = srgbToLinear('#c9a97d');
const emissiveBase = srgbToLinear('#8a6530');
const emissiveIntensity = 0.2;
const emissive = emissiveBase.map(c => c * emissiveIntensity);

const root = doc.getRoot();
for (const mesh of root.listMeshes()) {
  if (mesh.getName() === 'CHROME') {
    for (const prim of mesh.listPrimitives()) {
      const mat = prim.getMaterial();
      if (mat) {
        console.log(`Updating material: ${mat.getName()}`);
        mat.setBaseColorFactor([...baseColor, 1.0]);
        mat.setMetallicFactor(0.6);
        mat.setRoughnessFactor(0.15);
        mat.setEmissiveFactor(emissive);
        mat.setBaseColorTexture(null);
      }
    }
  }
}

await io.write('public/models_optimized/harvey_swivel_chair_mineral_blue.glb', doc);
console.log('Done – chair legs now match portal ring material.');