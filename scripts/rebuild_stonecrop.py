#!/usr/bin/env python3
"""Rebuild stringy_stonecrop.glb: rectangular planter box + directional stem culling."""
import struct, shutil
from pathlib import Path
import numpy as np
import pygltflib

GLB_PATH = Path("public/models/stringy_stonecrop.glb")

# Planter box dimensions (model space: X=vertical, Y=wide, Z=narrow)
BOX_X_BOTTOM = np.float32(0.317)
BOX_X_RIM    = np.float32(0.397)
BOX_Y_HALF   = np.float32(0.18)   # wide axis  → total 0.36
BOX_Z_HALF   = np.float32(0.06)   # narrow axis → total 0.12

# Stem zone thresholds
WALL_Z_THRESH  = -0.04  # cz < this → wall side, delete triangle
SIDE_Y_THRESH  = 0.12   # |cy| > this → narrow side, scale height
SIDE_X_SCALE   = 0.55   # shrink stem height above rim to 55%


def read_accessor(binary: bytes, gltf: pygltflib.GLTF2, idx: int) -> np.ndarray:
    """Extract accessor data from binary blob into a numpy array."""
    acc = gltf.accessors[idx]
    bv  = gltf.bufferViews[acc.bufferView]
    offset = (bv.byteOffset or 0) + (acc.byteOffset or 0)
    type_comps = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}
    comp_info  = {5120: ('b', 1), 5121: ('B', 1), 5122: ('h', 2),
                  5123: ('H', 2), 5125: ('I', 4), 5126: ('f',  4)}
    n_comp       = type_comps[acc.type]
    fmt, comp_sz = comp_info[acc.componentType]
    n            = acc.count
    stride       = bv.byteStride or (n_comp * comp_sz)
    fmt_to_dt = {'b': np.int8, 'B': np.uint8, 'h': np.int16,
                 'H': np.uint16, 'I': np.uint32, 'f': np.float32}
    if stride == n_comp * comp_sz:
        raw  = binary[offset: offset + n * n_comp * comp_sz]
        flat = struct.unpack(f"{n * n_comp}{fmt}", raw)
        dt   = fmt_to_dt[fmt]
        return np.array(flat, dtype=dt).reshape(n, n_comp)
    # Interleaved stride
    dt  = fmt_to_dt[fmt]
    out = np.zeros((n, n_comp), dtype=dt)
    for i in range(n):
        chunk    = binary[offset + i * stride: offset + i * stride + n_comp * comp_sz]
        out[i]   = struct.unpack(f"{n_comp}{fmt}", chunk)
    return out


def make_box_geometry():
    """
    Generate flat-shaded box mesh for the planter.
    Returns (positions, normals, uvs, indices) as float32/uint32 numpy arrays.
    24 vertices (4 per face × 6 faces), 12 triangles.
    """
    xb, xt = BOX_X_BOTTOM, BOX_X_RIM
    yh, zh  = BOX_Y_HALF,  BOX_Z_HALF

    # Each face: list of 4 (x,y,z) corners + outward normal
    face_defs = [
        # top lid (+X)
        ([(xt,-yh,-zh),(xt, yh,-zh),(xt, yh, zh),(xt,-yh, zh)], ( 1, 0, 0)),
        # bottom (-X)
        ([(xb,-yh, zh),(xb, yh, zh),(xb, yh,-zh),(xb,-yh,-zh)], (-1, 0, 0)),
        # front (+Z)
        ([(xb,-yh, zh),(xb, yh, zh),(xt, yh, zh),(xt,-yh, zh)], ( 0, 0, 1)),
        # back/wall (-Z)
        ([(xb, yh,-zh),(xb,-yh,-zh),(xt,-yh,-zh),(xt, yh,-zh)], ( 0, 0,-1)),
        # right (+Y)
        ([(xb, yh, zh),(xb, yh,-zh),(xt, yh,-zh),(xt, yh, zh)], ( 0, 1, 0)),
        # left  (-Y)
        ([(xb,-yh,-zh),(xb,-yh, zh),(xt,-yh, zh),(xt,-yh,-zh)], ( 0,-1, 0)),
    ]

    verts, normals, uvs, indices = [], [], [], []
    base = 0
    uv_corners = [(0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0)]
    for face_verts, normal in face_defs:
        for i, v in enumerate(face_verts):
            verts.append(v)
            normals.append(normal)
            uvs.append(uv_corners[i])
        indices.extend([base, base+1, base+2, base, base+2, base+3])
        base += 4

    idx = np.array(indices, dtype=np.uint32).reshape(-1, 3)
    return (np.array(verts,   dtype=np.float32),
            np.array(normals, dtype=np.float32),
            np.array(uvs,     dtype=np.float32),
            idx)


def filter_stem_mesh(pos: np.ndarray, normals: np.ndarray, uvs: np.ndarray,
                     idx_tris: np.ndarray, tangents=None):
    """
    Apply wall-cull and narrow-side height-scale to one stem/leaf mesh.
    Returns (new_pos, new_normals, new_uvs, new_tangents_or_None, new_idx).
    """
    keep = []   # list of (tri_indices_tuple, needs_scale: bool)

    for tri in idx_tris:
        v0, v1, v2 = pos[tri[0]], pos[tri[1]], pos[tri[2]]
        if min(float(v0[2]), float(v1[2]), float(v2[2])) < WALL_Z_THRESH:
            continue                         # wall side — delete
        needs_scale = max(abs(float(v0[1])), abs(float(v1[1])), abs(float(v2[1]))) > SIDE_Y_THRESH
        keep.append((tri, needs_scale))

    if not keep:
        empty = np.zeros((0, 3), dtype=np.float32)
        empty_idx = np.zeros((0, 3), dtype=np.uint32)
        return empty, empty, np.zeros((0, 2), dtype=np.float32), None, empty_idx

    # Collect used old vertex indices in sorted order for determinism
    used_old = sorted({int(v) for tri, _ in keep for v in tri})
    old_to_new = {old: new for new, old in enumerate(used_old)}

    new_pos     = pos[used_old].copy()
    new_normals = normals[used_old].copy()
    new_uvs     = uvs[used_old].copy()
    new_tangents = tangents[used_old].copy() if tangents is not None else None

    # Scale X on narrow-side triangles — duplicate verts shared with center zone
    # to avoid contaminating non-scaled geometry
    center_verts = {old_to_new[int(v)] for tri, flag in keep if not flag for v in tri}
    dup_map: dict[int, int] = {}  # old new-idx → duplicated new-idx
    extra_pos, extra_nrm, extra_uv = [], [], []
    extra_tan = [] if new_tangents is not None else None

    final_idx = []
    for tri, flag in keep:
        new_tri = [old_to_new[int(v)] for v in tri]
        if flag:
            scaled_tri = []
            for nv in new_tri:
                x = new_pos[nv, 0]
                if x <= BOX_X_RIM:
                    scaled_tri.append(nv)  # at/below rim — no scaling needed, safe to share
                    continue
                if nv in center_verts:
                    # shared with center zone — duplicate
                    if nv not in dup_map:
                        dup_idx = len(new_pos) + len(extra_pos)
                        dup_map[nv] = dup_idx
                        new_x = BOX_X_RIM + (x - BOX_X_RIM) * SIDE_X_SCALE
                        ep = new_pos[nv].copy(); ep[0] = new_x
                        extra_pos.append(ep)
                        extra_nrm.append(new_normals[nv].copy())
                        extra_uv.append(new_uvs[nv].copy())
                        if extra_tan is not None:
                            extra_tan.append(new_tangents[nv].copy())
                    scaled_tri.append(dup_map[nv])
                else:
                    # not shared — scale in place
                    if nv not in dup_map:
                        dup_map[nv] = nv  # mark as scaled
                        new_pos[nv, 0] = BOX_X_RIM + (x - BOX_X_RIM) * SIDE_X_SCALE
                    scaled_tri.append(nv)
            final_idx.append(scaled_tri)
        else:
            final_idx.append(new_tri)

    if extra_pos:
        new_pos     = np.concatenate([new_pos,     np.array(extra_pos, dtype=np.float32)])
        new_normals = np.concatenate([new_normals,  np.array(extra_nrm, dtype=np.float32)])
        new_uvs     = np.concatenate([new_uvs,      np.array(extra_uv,  dtype=np.float32)])
        if new_tangents is not None and extra_tan:
            new_tangents = np.concatenate([new_tangents, np.array(extra_tan, dtype=np.float32)])

    new_idx = np.array(final_idx, dtype=np.uint32)
    return new_pos, new_normals, new_uvs, new_tangents, new_idx


def pack_mesh(pos: np.ndarray, normals: np.ndarray, uvs: np.ndarray,
              idx: np.ndarray, tangents=None):
    """Pack one mesh's data into raw bytes."""
    return (pos.astype(np.float32).tobytes(),
            normals.astype(np.float32).tobytes(),
            uvs.astype(np.float32).tobytes(),
            tangents.astype(np.float32).tobytes() if tangents is not None else None,
            idx.astype(np.uint32).tobytes())


def rebuild():
    gltf   = pygltflib.GLTF2().load(str(GLB_PATH))
    binary = gltf.binary_blob()

    # Backup original
    bak = GLB_PATH.with_suffix(".glb.bak")
    shutil.copy(GLB_PATH, bak)
    print(f"Backed up original → {bak}")

    # ── Read and filter stem/leaf meshes (original indices 2, 3, 4) ──────────
    stem_data = []
    for orig_mesh_idx in [2, 3, 4]:
        m    = gltf.meshes[orig_mesh_idx]
        prim = m.primitives[0]
        pos_a   = prim.attributes.POSITION
        nrm_a   = prim.attributes.NORMAL
        uv_a    = prim.attributes.TEXCOORD_0
        tan_a   = getattr(prim.attributes, 'TANGENT', None)
        idx_a   = prim.indices
        mat_idx = prim.material

        pos_arr  = read_accessor(binary, gltf, pos_a).astype(np.float32)
        nrm_arr  = read_accessor(binary, gltf, nrm_a).astype(np.float32)
        uv_arr   = read_accessor(binary, gltf, uv_a).astype(np.float32)
        tan_arr  = read_accessor(binary, gltf, tan_a).astype(np.float32) if tan_a is not None else None
        idx_flat = read_accessor(binary, gltf, idx_a).flatten().astype(np.uint32)
        idx_tris = idx_flat.reshape(-1, 3)

        new_pos, new_nrm, new_uv, new_tan, new_idx = filter_stem_mesh(
            pos_arr, nrm_arr, uv_arr, idx_tris, tangents=tan_arr)

        stem_data.append({
            'name':     m.name,
            'pos':      new_pos,
            'normals':  new_nrm,
            'uvs':      new_uv,
            'tangents': new_tan,
            'idx':      new_idx,
            'mat':      mat_idx - 1,  # shift: rope material (index 0) removed
        })
        print(f"  {m.name}: {len(idx_tris)} → {len(new_idx)} triangles "
              f"({len(idx_tris) - len(new_idx)} culled)")

    # ── Generate box vase ─────────────────────────────────────────────────────
    box_pos, box_nrm, box_uv, box_idx = make_box_geometry()
    print(f"  Box vase: {len(box_idx)} triangles, {len(box_pos)} verts")

    # ── Ordered mesh list for new GLB ─────────────────────────────────────────
    meshes_out = [
        {'name': 'Herb.003_Vase_0', 'pos': box_pos, 'normals': box_nrm,
         'uvs': box_uv, 'tangents': None, 'idx': box_idx, 'mat': 0},
        *stem_data,
    ]

    # ── Collect image blobs from original buffer views 4-7 ───────────────────
    image_blobs = []
    for bv_idx in range(4, len(gltf.bufferViews)):
        bv   = gltf.bufferViews[bv_idx]
        blob = binary[(bv.byteOffset or 0): (bv.byteOffset or 0) + bv.byteLength]
        image_blobs.append(blob)

    # ── Build binary buffer blocks ────────────────────────────────────────────
    def pad4(b: bytes) -> bytes:
        rem = len(b) % 4
        return b + b"\x00" * ((4 - rem) % 4)

    # Index block
    idx_bytes_list = [m['idx'].astype(np.uint32).tobytes() for m in meshes_out]
    idx_offsets = []
    cur = 0
    for b in idx_bytes_list:
        idx_offsets.append(cur)
        cur += len(b)
    idx_block = pad4(b"".join(idx_bytes_list))

    # Position block
    pos_bytes_list = [m['pos'].astype(np.float32).tobytes() for m in meshes_out]
    pos_offsets = []
    cur = 0
    for b in pos_bytes_list:
        pos_offsets.append(cur)
        cur += len(b)
    pos_block = pad4(b"".join(pos_bytes_list))

    # Normal block
    nrm_bytes_list = [m['normals'].astype(np.float32).tobytes() for m in meshes_out]
    nrm_offsets = []
    cur = 0
    for b in nrm_bytes_list:
        nrm_offsets.append(cur)
        cur += len(b)
    nrm_block = pad4(b"".join(nrm_bytes_list))

    # UV block
    uv_bytes_list = [m['uvs'].astype(np.float32).tobytes() for m in meshes_out]
    uv_offsets = []
    cur = 0
    for b in uv_bytes_list:
        uv_offsets.append(cur)
        cur += len(b)
    uv_block = pad4(b"".join(uv_bytes_list))

    # Tangent block
    has_tangent = [m['tangents'] is not None for m in meshes_out]
    tan_bytes_list = [m['tangents'].astype(np.float32).tobytes()
                      if m['tangents'] is not None else b""
                      for m in meshes_out]
    tan_offsets = []
    cur = 0
    for b in tan_bytes_list:
        tan_offsets.append(cur)
        cur += len(b)
    tan_block = pad4(b"".join(tan_bytes_list))

    # Image blobs
    img_parts = [pad4(blob) for blob in image_blobs]
    img_offsets_abs = []
    cur = len(idx_block) + len(pos_block) + len(nrm_block) + len(uv_block) + len(tan_block)
    for part in img_parts:
        img_offsets_abs.append(cur)
        cur += len(part)

    new_binary = idx_block + pos_block + nrm_block + uv_block + tan_block
    for part in img_parts:
        new_binary += part

    # ── Build new GLTF JSON ───────────────────────────────────────────────────
    new_gltf = pygltflib.GLTF2()
    new_gltf.asset = gltf.asset

    new_gltf.buffers = [pygltflib.Buffer(byteLength=len(new_binary))]

    BV_IDX = 0; BV_POS = 1; BV_NRM = 2; BV_UV = 3; BV_TAN = 4; BV_IMG0 = 5

    new_gltf.bufferViews = [
        pygltflib.BufferView(buffer=0, byteOffset=0,
                             byteLength=len(idx_block), target=34963),
        pygltflib.BufferView(buffer=0, byteOffset=len(idx_block),
                             byteLength=len(pos_block), target=34962),
        pygltflib.BufferView(buffer=0, byteOffset=len(idx_block) + len(pos_block),
                             byteLength=len(nrm_block), target=34962),
        pygltflib.BufferView(buffer=0,
                             byteOffset=len(idx_block) + len(pos_block) + len(nrm_block),
                             byteLength=len(uv_block), target=34962),
        pygltflib.BufferView(buffer=0,
                             byteOffset=len(idx_block) + len(pos_block) + len(nrm_block) + len(uv_block),
                             byteLength=len(tan_block), target=34962),
    ]
    for i, (blob, part) in enumerate(zip(image_blobs, img_parts)):
        new_gltf.bufferViews.append(
            pygltflib.BufferView(buffer=0, byteOffset=img_offsets_abs[i],
                                 byteLength=len(blob), target=None)
        )

    # Accessors + Meshes
    acc_idx = 0
    new_gltf.accessors = []
    new_gltf.meshes    = []

    for mi, m in enumerate(meshes_out):
        n_tris  = len(m['idx'])
        n_verts = len(m['pos'])

        i_acc = acc_idx
        new_gltf.accessors.append(pygltflib.Accessor(
            bufferView=BV_IDX, byteOffset=idx_offsets[mi],
            componentType=5125, count=n_tris * 3, type="SCALAR",
            min=[int(m['idx'].min())], max=[int(m['idx'].max())],
        ))
        acc_idx += 1

        p_acc = acc_idx
        new_gltf.accessors.append(pygltflib.Accessor(
            bufferView=BV_POS, byteOffset=pos_offsets[mi],
            componentType=5126, count=n_verts, type="VEC3",
            min=m['pos'].min(axis=0).tolist(),
            max=m['pos'].max(axis=0).tolist(),
        ))
        acc_idx += 1

        n_acc = acc_idx
        new_gltf.accessors.append(pygltflib.Accessor(
            bufferView=BV_NRM, byteOffset=nrm_offsets[mi],
            componentType=5126, count=n_verts, type="VEC3",
        ))
        acc_idx += 1

        uv_acc = acc_idx
        new_gltf.accessors.append(pygltflib.Accessor(
            bufferView=BV_UV, byteOffset=uv_offsets[mi],
            componentType=5126, count=n_verts, type="VEC2",
        ))
        acc_idx += 1

        t_acc = None
        if has_tangent[mi]:
            t_acc = acc_idx
            new_gltf.accessors.append(pygltflib.Accessor(
                bufferView=BV_TAN, byteOffset=tan_offsets[mi],
                componentType=5126, count=n_verts, type="VEC4",
            ))
            acc_idx += 1

        attrs = pygltflib.Attributes(POSITION=p_acc, NORMAL=n_acc, TEXCOORD_0=uv_acc)
        if t_acc is not None:
            attrs.TANGENT = t_acc

        new_gltf.meshes.append(pygltflib.Mesh(
            name=m['name'],
            primitives=[pygltflib.Primitive(
                attributes=attrs, indices=i_acc, material=m['mat'],
            )]
        ))

    # Materials: drop rope (index 0), keep the rest
    new_gltf.materials = gltf.materials[1:]

    # Textures, samplers: copy as-is
    new_gltf.textures = gltf.textures
    new_gltf.samplers = gltf.samplers

    # Images: remap bufferView indices (original BVs 4-7 → new BVs 5-8)
    orig_img_bv_start = 4
    new_gltf.images = []
    for img in gltf.images:
        new_gltf.images.append(pygltflib.Image(
            name=img.name,
            mimeType=img.mimeType,
            bufferView=(img.bufferView - orig_img_bv_start + BV_IMG0)
                       if img.bufferView is not None else None,
        ))

    # Nodes: remove rope node (original index 4), remap children + mesh refs
    import copy
    skip_node = 4
    old_to_new_node = {}
    new_nodes = []
    for i, node in enumerate(gltf.nodes):
        if i == skip_node:
            continue
        old_to_new_node[i] = len(new_nodes)
        new_nodes.append(copy.deepcopy(node))

    for node in new_nodes:
        if node.children:
            node.children = [old_to_new_node[c] for c in node.children
                              if c in old_to_new_node]
        if node.mesh is not None:
            assert node.mesh != 0, f"Unexpected surviving node references rope mesh (mesh=0)"
            # mesh 0(rope)→removed, 1(vase)→0, 2(stem)→1, 3(leaf)→2, 4(leaf)→3
            node.mesh = node.mesh - 1

    new_gltf.nodes = new_nodes
    new_gltf.scenes = [pygltflib.Scene(
        name=gltf.scenes[0].name,
        nodes=[old_to_new_node[n] for n in gltf.scenes[0].nodes
               if n in old_to_new_node],
    )]
    new_gltf.scene = 0

    new_gltf.set_binary_blob(new_binary)
    new_gltf.save(str(GLB_PATH))
    print(f"\nSaved rebuilt GLB → {GLB_PATH}  ({len(new_binary) / 1024:.1f} KB binary)")


if __name__ == "__main__":
    rebuild()
