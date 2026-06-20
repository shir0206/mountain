import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

function inspect(doc, label) {
  const root = doc.getRoot();
  console.log(`\n=== ${label} ===`);
  
  const materials = root.listMaterials();
  console.log(`Materials (${materials.length}):`);
  for (const mat of materials) {
    console.log(`  - "${mat.getName()}"`);
  }

  const meshes = root.listMeshes();
  console.log(`Meshes (${meshes.length}):`);
  for (const mesh of meshes) {
    const prims = mesh.listPrimitives();
    const matNames = prims.map(p => p.getMaterial()?.getName() || '(none)');
    console.log(`  - "${mesh.getName()}" → materials: [${matNames.join(', ')}]`);
  }

  const nodes = root.listNodes();
  console.log(`Nodes (${nodes.length}):`);
  for (const node of nodes) {
    const meshName = node.getMesh()?.getName() || null;
    if (meshName) {
      console.log(`  - "${node.getName()}" → mesh: "${meshName}"`);
    }
  }
}

const docFloor = await io.read('public/models/pergola_floor.glb');
inspect(docFloor, 'pergola_floor.glb');

const docStructure = await io.read('public/models/pergola_structure.glb');
inspect(docStructure, 'pergola_structure.glb');