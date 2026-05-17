"""Build the authored Tickerverse Blender scene and export it as GLB.

Run from the repo root with:

    blender --background --python scripts/blender/tickerverse_scene.py -- \
      --input-district public/models/tickerverse/period-financial-district.glb \
      --man-image public/images/tickerverse/tickerville-man-photo.png \
      --blend public/models/tickerverse/tickerverse-scene.blend \
      --glb public/models/tickerverse/tickerverse-scene.glb
"""

from __future__ import annotations

import argparse
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector


EARTH_OLIVE = (0.404, 0.388, 0.31, 1.0)
OLD_PAPER = (0.678, 0.67, 0.565, 1.0)
ESPRESSO = (0.196, 0.165, 0.161, 1.0)
SKY_BLUE = (0.604, 0.792, 0.91, 1.0)
TAPE_GOLD = (0.87, 0.61, 0.25, 1.0)
TAPE_INK = (0.23, 0.14, 0.33, 1.0)

TAPE_MARKS = [
    "111K",
    "37⅛",
    "114½",
    "35.44",
    "47¼",
    "100M",
    "73⅜",
    "21¼",
    "16⅞",
    "83½",
    "29.10",
    "64⅛",
    "12½",
    "90¼",
    "5⅜",
    "142",
    "18⅝",
    "3.22",
    "78¾",
    "40⅛",
    "9⅝",
    "210",
    "56¼",
    "31⅜",
]


def parse_args() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser(description="Generate the Tickerverse Blender scene.")
    parser.add_argument("--input-district", required=True)
    parser.add_argument("--man-image", required=True)
    parser.add_argument("--blend", required=True)
    parser.add_argument("--glb", required=True)
    parser.add_argument("--seed", type=int, default=1929)
    return parser.parse_args(argv)


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def material(name: str, color: tuple[float, float, float, float], roughness: float = 0.92) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def image_material(name: str, image_path: Path) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = bpy.data.images.load(str(image_path))
    texture.extension = "CLIP"
    mat.node_tree.links.new(texture.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.88
    return mat


def add_rect_mesh(
    name: str,
    center: tuple[float, float, float],
    width: float,
    height: float,
    mat: bpy.types.Material,
) -> bpy.types.Object:
    x, y, z = center
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(
        [
            (x - width / 2, y, z - height / 2),
            (x + width / 2, y, z - height / 2),
            (x + width / 2, y, z + height / 2),
            (x - width / 2, y, z + height / 2),
        ],
        [],
        [(0, 1, 2, 3)],
    )
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    obj.data.materials.append(mat)
    bpy.context.collection.objects.link(obj)
    return obj


def add_box(name: str, location: tuple[float, float, float], scale: tuple[float, float, float], mat: bpy.types.Material) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    return obj


def look_at(obj: bpy.types.Object, target: tuple[float, float, float]) -> None:
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def import_district(input_path: Path) -> None:
    bpy.ops.import_scene.gltf(filepath=str(input_path))
    imported = list(bpy.context.selected_objects)
    parent = bpy.data.objects.new("FiDi_1925_1935_IMPORTED", None)
    bpy.context.collection.objects.link(parent)

    for obj in imported:
        obj.parent = parent
        if hasattr(obj, "data") and hasattr(obj.data, "materials"):
            for slot in obj.material_slots:
                if slot.material and slot.material.use_nodes:
                    bsdf = slot.material.node_tree.nodes.get("Principled BSDF")
                    if bsdf:
                        bsdf.inputs["Roughness"].default_value = 1.0

    parent.location = (0.2, 0.0, -0.3)
    parent.rotation_euler = (0.0, 0.0, math.radians(-15))
    parent.scale = (0.82, 0.82, 0.82)


def add_ground(mats: dict[str, bpy.types.Material]) -> None:
    add_box("earth_tone_ground", (0, 0, -0.08), (42, 32, 0.12), mats["ground"])
    add_box("low_shadow_band", (0, -5.2, 0.03), (42, 6, 0.08), mats["shadow"])


def add_man_placard(man_image: Path, mats: dict[str, bpy.types.Material]) -> None:
    photo_mat = image_material("tickerville_man_photo_material", man_image)
    frame = add_rect_mesh("tickerville_man_dark_mount", (-6.1, -6.4, 1.72), 2.45, 2.34, mats["espresso"])
    photo = add_rect_mesh("tickerville_man_photo", (-6.1, -6.46, 1.72), 2.16, 2.02, photo_mat)
    frame.rotation_euler[2] = math.radians(-4)
    photo.rotation_euler[2] = math.radians(-4)
    add_box("man_placard_base", (-6.1, -6.34, 0.48), (2.76, 0.22, 0.14), mats["espresso"])
    add_box("man_placard_left_post", (-7.04, -6.38, 1.0), (0.08, 0.12, 1.48), mats["espresso"])
    add_box("man_placard_right_post", (-5.16, -6.38, 1.0), (0.08, 0.12, 1.48), mats["espresso"])


def add_tape_mesh(
    name: str,
    z_center: float,
    y: float,
    width: float,
    angle: float,
    alpha_name: str,
    mats: dict[str, bpy.types.Material],
    seed: int,
) -> None:
    random.seed(seed)
    segment_count = 64
    x_min = -19.0
    x_max = 19.0
    verts = []
    faces = []

    for i in range(segment_count + 1):
        t = i / segment_count
        x = x_min + (x_max - x_min) * t
        wave = math.sin(t * math.tau * 1.6 + seed * 0.01) * 0.18
        edge_noise = math.sin(t * math.tau * 7.0 + seed * 0.03) * 0.035
        center = z_center + wave
        verts.append((x, y, center - width / 2 + edge_noise))
        verts.append((x, y, center + width / 2 - edge_noise))
        if i < segment_count:
            a = i * 2
            faces.append((a, a + 1, a + 3, a + 2))

    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    tape = bpy.data.objects.new(name, mesh)
    tape.data.materials.append(mats["tape"])
    bpy.context.collection.objects.link(tape)
    tape.rotation_euler[1] = math.radians(angle)

    lane_offsets = [-0.34, -0.18, -0.04, 0.16, 0.31]
    for i in range(34):
        x = x_min + 1.2 + i * 1.1
        mark = random.choice(TAPE_MARKS)
        if random.random() > 0.72:
            mark = f"{mark}′"
        z = z_center + random.choice(lane_offsets)
        bpy.ops.object.text_add(location=(x, y - 0.07, z), rotation=(math.radians(90), 0, math.radians(angle + random.uniform(-2, 2))))
        txt = bpy.context.object
        txt.name = f"{alpha_name}_mark_{i:02d}"
        txt.data.body = mark
        txt.data.align_x = "CENTER"
        txt.data.align_y = "CENTER"
        txt.data.size = 0.52 if width > 1 else 0.38
        txt.data.extrude = 0.002
        txt.data.materials.append(mats["ink"])


def add_tapes(mats: dict[str, bpy.types.Material], seed: int) -> None:
    add_tape_mesh("ticker_tape_far", 4.45, -5.8, 0.62, 7.5, "far", mats, seed + 1)
    add_tape_mesh("ticker_tape_mid", 3.35, -6.1, 0.78, -8.0, "mid", mats, seed + 2)
    add_tape_mesh("ticker_tape_near", 2.75, -6.7, 1.05, 1.5, "near", mats, seed + 3)


def convert_text_to_meshes() -> None:
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.context.scene.objects:
        if obj.type == "FONT":
            obj.select_set(True)
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.convert(target="MESH")
            obj.select_set(False)


def add_lighting_and_camera() -> None:
    bpy.context.scene.world = bpy.data.worlds.new("Tickerverse_World")
    bpy.context.scene.world.color = OLD_PAPER[:3]

    bpy.ops.object.light_add(type="AREA", location=(0, -7.5, 8.5))
    key = bpy.context.object
    key.name = "soft_old_paper_key_light"
    key.data.energy = 520
    key.data.size = 7

    bpy.ops.object.light_add(type="POINT", location=(-6, -4, 3.5))
    fill = bpy.context.object
    fill.name = "clear_sky_blue_fill"
    fill.data.color = SKY_BLUE[:3]
    fill.data.energy = 55

    bpy.ops.object.camera_add(location=(1.0, -16.0, 4.25))
    camera = bpy.context.object
    camera.name = "tickerverse_camera"
    camera.data.lens = 36
    camera.data.dof.use_dof = True
    camera.data.dof.focus_distance = 12
    camera.data.dof.aperture_fstop = 6.5
    look_at(camera, (-1.35, -3.2, 1.8))
    bpy.context.scene.camera = camera


def set_render_settings() -> None:
    bpy.context.scene.render.engine = "CYCLES"
    bpy.context.scene.cycles.samples = 64
    bpy.context.scene.view_settings.view_transform = "Filmic"
    bpy.context.scene.view_settings.look = "Medium High Contrast"
    bpy.context.scene.render.resolution_x = 1440
    bpy.context.scene.render.resolution_y = 900


def main() -> None:
    args = parse_args()
    random.seed(args.seed)

    input_district = Path(args.input_district).resolve()
    man_image = Path(args.man_image).resolve()
    blend_path = Path(args.blend).resolve()
    glb_path = Path(args.glb).resolve()
    blend_path.parent.mkdir(parents=True, exist_ok=True)
    glb_path.parent.mkdir(parents=True, exist_ok=True)

    clear_scene()
    mats = {
        "ground": material("olive_harbor_ground", EARTH_OLIVE),
        "shadow": material("espresso_ground_shadow", (0.15, 0.13, 0.12, 1.0)),
        "espresso": material("espresso_blackened_wood", ESPRESSO),
        "tape": material("aged_golden_ticker_tape", TAPE_GOLD),
        "ink": material("purple_ticker_ink", TAPE_INK),
    }

    import_district(input_district)
    add_ground(mats)
    add_man_placard(man_image, mats)
    add_tapes(mats, args.seed)
    convert_text_to_meshes()
    add_lighting_and_camera()
    set_render_settings()

    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))
    bpy.ops.export_scene.gltf(
        filepath=str(glb_path),
        export_format="GLB",
        export_apply=True,
        export_materials="EXPORT",
    )


if __name__ == "__main__":
    main()
