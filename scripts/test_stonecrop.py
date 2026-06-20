#!/usr/bin/env python3
"""Geometry assertions for rebuild_stonecrop output. Run after rebuild."""
import sys, struct
from pathlib import Path
import numpy as np
import pygltflib

sys.path.insert(0, str(Path(__file__).parent))
from rebuild_stonecrop import (
    make_box_geometry, filter_stem_mesh,
    BOX_X_BOTTOM, BOX_X_RIM, BOX_Y_HALF, BOX_Z_HALF,
    WALL_Z_THRESH, SIDE_Y_THRESH, SIDE_X_SCALE, read_accessor
)

PASS = "\033[32mPASS\033[0m"
FAIL = "\033[31mFAIL\033[0m"
failures = []

def check(name, condition, detail=""):
    if condition:
        print(f"  {PASS}  {name}")
    else:
        print(f"  {FAIL}  {name}  {detail}")
        failures.append(name)


# ── Unit: make_box_geometry ───────────────────────────────────────────────────
print("make_box_geometry()")
verts, normals, uvs, indices = make_box_geometry()

check("24 vertices",       len(verts)   == 24)
check("24 normals",        len(normals) == 24)
check("24 uvs",            len(uvs)     == 24)
check("12 triangles",      len(indices) == 12)
check("indices uint32",    indices.dtype == np.uint32)
check("verts float32",     verts.dtype   == np.float32)

# All Y within ±BOX_Y_HALF
check("Y within wide bound",  np.all(np.abs(verts[:,1]) <= BOX_Y_HALF + 1e-5))
# All Z within ±BOX_Z_HALF
check("Z within narrow bound", np.all(np.abs(verts[:,2]) <= BOX_Z_HALF + 1e-5))
# X only at bottom or rim
x_vals = np.unique(np.round(verts[:,0], 4))
check("X only bottom/rim", set(x_vals).issubset({round(BOX_X_BOTTOM,4), round(BOX_X_RIM,4)}),
      f"got {x_vals}")
# All normals unit-length
lengths = np.linalg.norm(normals, axis=1)
check("normals unit length", np.allclose(lengths, 1.0))


# ── Unit: filter_stem_mesh ────────────────────────────────────────────────────
print("\nfilter_stem_mesh()")

rng = np.random.default_rng(42)
# 9 synthetic triangles: 3 wall, 3 narrow-side, 3 center
n_verts = 27
pos = rng.random((n_verts, 3)).astype(np.float32) * 0.1 + np.float32(BOX_X_RIM + 0.05)
pos[:, 0] += 0.05    # make sure X is above rim

# Wall-side triangles: cz < WALL_Z_THRESH  → set z of verts 0-8 to -0.05
pos[:9, 2]   = -0.05
# Narrow-side triangles: |cy| > SIDE_Y_THRESH → set y of verts 9-17 to 0.15
pos[9:18, 1] = 0.15
# Center triangles: verts 18-26 unchanged (cy and cz in safe zone)
pos[18:, 1]  = 0.0
pos[18:, 2]  = 0.0

normals_s  = np.ones((n_verts, 3), dtype=np.float32)
uvs_s      = np.zeros((n_verts, 2), dtype=np.float32)
idx_tris   = np.array([[i*3, i*3+1, i*3+2] for i in range(9)], dtype=np.uint32)

new_pos, new_nrm, new_uv, new_tan, new_idx = filter_stem_mesh(
    pos, normals_s, uvs_s, idx_tris, tangents=None
)

check("wall triangles deleted (3 of 9 gone → 6 remain)", len(new_idx) == 6,
      f"got {len(new_idx)}")
check("no vertex has cz < WALL_Z_THRESH", np.all(new_pos[:, 2] >= WALL_Z_THRESH),
      f"min cz={new_pos[:,2].min():.4f}")

# Narrow-side verts should have scaled X
narrow_verts_mask = new_pos[:, 1] > SIDE_Y_THRESH
if narrow_verts_mask.any():
    orig_x = pos[9, 0]  # one of the narrow verts (before scaling)
    expected_x = BOX_X_RIM + (orig_x - BOX_X_RIM) * SIDE_X_SCALE
    actual_x = new_pos[narrow_verts_mask][0, 0]
    check("narrow-side X scaled correctly",
          abs(actual_x - expected_x) < 1e-5,
          f"expected {expected_x:.5f} got {actual_x:.5f}")
else:
    check("narrow-side verts present", False, "no narrow verts found in output")

# Center verts untouched
center_mask = (np.abs(new_pos[:, 1]) <= SIDE_Y_THRESH) & (new_pos[:, 2] >= WALL_Z_THRESH)
if center_mask.any():
    orig_center_x = pos[18, 0]
    actual_center_x = new_pos[center_mask][0, 0]
    check("center-zone X unchanged", abs(actual_center_x - orig_center_x) < 1e-5,
          f"expected {orig_center_x:.5f} got {actual_center_x:.5f}")
else:
    check("center-zone verts present", False, "no center verts found in output")


# ── Integration: rebuilt GLB file ─────────────────────────────────────────────
print("\nRebuilt GLB file")
GLB_OUT = Path("public/models/stringy_stonecrop.glb")
if not GLB_OUT.exists():
    print(f"  {FAIL}  GLB not found at {GLB_OUT}")
    failures.append("GLB exists")
else:
    gltf = pygltflib.GLTF2().load(str(GLB_OUT))
    binary = gltf.binary_blob()

    check("no rope node",
          not any("rope" in (n.name or "") for n in gltf.nodes))
    check("no rope mesh",
          not any("rope" in (m.name or "") for m in gltf.meshes))
    check("no rope material",
          not any("rope" in (m.name or "") for m in gltf.materials))

    # Find vase mesh
    vase_mesh = next((m for m in gltf.meshes if "Vase" in (m.name or "")), None)
    check("vase mesh present", vase_mesh is not None)
    if vase_mesh:
        prim = vase_mesh.primitives[0]
        pos_data = read_accessor(binary, gltf, prim.attributes.POSITION)
        check("vase Y half-width ≈ 0.18",
              abs(pos_data[:,1].max() - BOX_Y_HALF) < 0.01,
              f"got {pos_data[:,1].max():.4f}")
        check("vase Z half-depth ≈ 0.06",
              abs(pos_data[:,2].max() - BOX_Z_HALF) < 0.01,
              f"got {pos_data[:,2].max():.4f}")
        check("vase 24 verts", len(pos_data) == 24, f"got {len(pos_data)}")

    # Stem meshes: no vertices past wall threshold
    for mesh in gltf.meshes:
        if "stem" in (mesh.name or "") or "Herb_Leaf" in (mesh.name or ""):
            prim = mesh.primitives[0]
            pos_data = read_accessor(binary, gltf, prim.attributes.POSITION)
            check(f"{mesh.name}: no wall-side verts (min Z ≥ {WALL_Z_THRESH})",
                  float(pos_data[:,2].min()) >= WALL_Z_THRESH - 0.001,
                  f"min Z={pos_data[:,2].min():.4f}")


# ── Summary ───────────────────────────────────────────────────────────────────
print(f"\n{'All tests passed!' if not failures else f'{len(failures)} test(s) FAILED: ' + str(failures)}")
sys.exit(0 if not failures else 1)
