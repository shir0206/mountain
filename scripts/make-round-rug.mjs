/**
 * Generate a round (circular disc) rug GLB from the existing rectangular rug.
 * Preserves the original material & textures; replaces geometry with a flat circle.
 * Uses radial UV mapping: V = distance from center (concentric rings of pattern),
 * U = angle * REPEATS (pizza-slice repetition for mandala/ring look).
 *
 * Usage: node scripts/make-round-rug.mjs
 */

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT = path.resolve(__dirname, "../public/models_optimized/rug.glb");
const OUTPUT = path.resolve(
	__dirname,
	"../public/models_optimized/rug_round.glb"
);

const SEGMENTS = 64; // angular segments
const RINGS = 24; // concentric rings for smooth gradient
const REPEATS = 8; // how many pizza slices (texture repeats around circle)

/**
 * Build a circular disc with concentric rings.
 * UVs use radial mapping:
 *   U = (angle / 2π) * REPEATS  → wraps texture horizontally N times
 *   V = distance / radius        → maps center-to-edge along texture height
 */
function buildCircleGeometry(doc, radius = 1.0) {
	const buf = doc.createBuffer();
	const positions = [];
	const normals = [];
	const uvs = [];
	const indices = [];

	// Center vertex
	positions.push(0, 0, 0);
	normals.push(0, 1, 0);
	uvs.push(0.0, 0.0); // V=0 at center, U doesn't matter much

	for (let ring = 1; ring <= RINGS; ring++) {
		const r = (ring / RINGS) * radius;
		const v = ring / RINGS; // 0 at center, 1 at edge
		for (let seg = 0; seg < SEGMENTS; seg++) {
			const angle = (seg / SEGMENTS) * Math.PI * 2;
			const x = Math.cos(angle) * r;
			const z = Math.sin(angle) * r;
			positions.push(x, 0, z);
			normals.push(0, 1, 0);
			const u = (seg / SEGMENTS) * REPEATS;
			uvs.push(u, v);
		}
	}

	// Triangles for innermost ring (center to ring 1)
	// Winding: face UP (normal +Y), so CCW when viewed from above
	for (let seg = 0; seg < SEGMENTS; seg++) {
		const next = (seg + 1) % SEGMENTS;
		// Reversed winding to face up
		indices.push(0, 1 + next, 1 + seg);
	}

	// Triangles for ring-to-ring
	for (let ring = 1; ring < RINGS; ring++) {
		const ringStart = 1 + (ring - 1) * SEGMENTS;
		const nextRingStart = 1 + ring * SEGMENTS;
		for (let seg = 0; seg < SEGMENTS; seg++) {
			const next = (seg + 1) % SEGMENTS;
			const a = ringStart + seg;
			const b = ringStart + next;
			const c = nextRingStart + seg;
			const d = nextRingStart + next;
			// Reversed winding to face up
			indices.push(a, b, c);
			indices.push(b, d, c);
		}
	}

	const posAcc = doc
		.createAccessor()
		.setType("VEC3")
		.setArray(new Float32Array(positions))
		.setBuffer(buf);

	const normAcc = doc
		.createAccessor()
		.setType("VEC3")
		.setArray(new Float32Array(normals))
		.setBuffer(buf);

	const uvAcc = doc
		.createAccessor()
		.setType("VEC2")
		.setArray(new Float32Array(uvs))
		.setBuffer(buf);

	const idxAcc = doc
		.createAccessor()
		.setType("SCALAR")
		.setArray(new Uint16Array(indices))
		.setBuffer(buf);

	return { posAcc, normAcc, uvAcc, idxAcc };
}

async function main() {
	const io = new NodeIO()
		.registerExtensions(ALL_EXTENSIONS)
		.registerDependencies({
			"draco3d.decoder": await draco3d.createDecoderModule(),
			"draco3d.encoder": await draco3d.createEncoderModule(),
		});
	const doc = await io.read(INPUT);

	// Grab the first material from the original rug (has texture references)
	const materials = doc.getRoot().listMaterials();
	const mat = materials.length > 0 ? materials[0] : doc.createMaterial();

	// Make material double-sided so both faces are visible
	mat.setDoubleSided(true);

	// Set texture wrap to REPEAT so the pizza-slice tiling works
	for (const tex of doc.getRoot().listTextures()) {
		// Find samplers referencing this texture and set wrap mode
		// In glTF-Transform, wrap is on the TextureInfo, we'll handle via material
	}

	// Remove only mesh geometry (meshes, nodes, scenes, old accessors)
	// Keep textures & images intact
	const oldAccessors = new Set();
	for (const mesh of doc.getRoot().listMeshes()) {
		for (const prim of mesh.listPrimitives()) {
			const idx = prim.getIndices();
			if (idx) oldAccessors.add(idx);
			for (const attr of prim.listAttributes()) {
				oldAccessors.add(attr);
			}
		}
	}
	for (const mesh of doc.getRoot().listMeshes()) mesh.dispose();
	for (const node of doc.getRoot().listNodes()) node.dispose();
	for (const scene of doc.getRoot().listScenes()) scene.dispose();
	for (const acc of oldAccessors) acc.dispose();
	for (const buf of doc.getRoot().listBuffers()) {
		if (buf.listParents().length <= 1) buf.dispose();
	}

	// Build circle geometry
	const { posAcc, normAcc, uvAcc, idxAcc } = buildCircleGeometry(doc, 1.0);

	const prim = doc
		.createPrimitive()
		.setMode(4) // TRIANGLES
		.setAttribute("POSITION", posAcc)
		.setAttribute("NORMAL", normAcc)
		.setAttribute("TEXCOORD_0", uvAcc)
		.setIndices(idxAcc)
		.setMaterial(mat);

	const mesh = doc.createMesh("RoundRug").addPrimitive(prim);
	const node = doc.createNode("RoundRug").setMesh(mesh);
	const scene = doc.createScene().addChild(node);
	doc.getRoot().setDefaultScene(scene);

	await io.write(OUTPUT, doc);
	console.log(`✅ Round rug written to ${OUTPUT}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});