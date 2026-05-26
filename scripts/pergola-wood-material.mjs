import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

// ── Step 1: Read coffee table and extract the WALNUT material ──
const tableDoc = await io.read('public/models_optimized/edelweiss_round_table_ash_and_white.glb');
const tableRoot = tableDoc.getRoot();

let walnutMat = null;
for (const mat of tableRoot.listMaterials()) {
  if (mat.getName() === 'WALNUT') {
    walnutMat = mat;
    break;
  }
}
if (!walnutMat) throw new Error('Could not find WALNUT material in coffee table');

const walnutTexture = walnutMat.getBaseColorTexture();
if (!walnutTexture) throw new Error('WALNUT material has no baseColor texture');

const walnutImage = walnutTexture.getImage();
const walnutMimeType = walnutTexture.getMimeType();
const walnutMetallic = walnutMat.getMetallicFactor();
const walnutRoughness = walnutMat.getRoughnessFactor();
const walnutBaseColor = walnutMat.getBaseColorFactor();

console.log('Source WALNUT texture:', walnutMimeType, 'size:', walnutImage?.byteLength, 'bytes');
console.log('  metallic:', walnutMetallic, 'roughness:', walnutRoughness, 'baseColor:', walnutBaseColor);

// ── Step 2: Read pergola ──
const pergolaDoc = await io.read('public/models/pegrola_-_micha.xml.glb');
const pergolaRoot = pergolaDoc.getRoot();

// ── Step 3: Create a new texture in pergola doc with the walnut image data ──
const newTexture = pergolaDoc.createTexture('walnut_wood_texture')
  .setImage(walnutImage)
  .setMimeType(walnutMimeType);

// ── Step 4: Apply to pergola's "material" (wood parts) ──
let updated = 0;
for (const mat of pergolaRoot.listMaterials()) {
  if (mat.getName() === 'material') {
    mat.setBaseColorFactor(walnutBaseColor);
    mat.setMetallicFactor(walnutMetallic);
    mat.setRoughnessFactor(walnutRoughness);
    mat.setBaseColorTexture(newTexture);
    mat.setEmissiveFactor([0, 0, 0]);
    updated++;
    console.log(`Updated: ${mat.getName()}`);
  }
}

await io.write('public/models/pegrola_-_micha.xml.glb', pergolaDoc);
console.log(`Done – ${updated} material(s) now use coffee table WALNUT wood texture.`);