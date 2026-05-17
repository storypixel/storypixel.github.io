# Tickerverse Model Credits

## `period-financial-district.glb`

- **Author:** OpenAI Codex for Bon Ayr Industries
- **License:** Generated scene wrapper is MIT. Building massing geometry is derived from NYC public Building Footprints data under NYC Open Data / NYC.gov terms.
- **Size:** 2.6 MB
- **Source URL:** NYCMaps Building Footprints FeatureServer: https://services6.arcgis.com/yG5s3afENB5iO9fj/arcgis/rest/services/BUILDING_view/FeatureServer/0
- **Source documentation:** https://github.com/CityOfNewYork/nyc-geo-metadata/blob/master/Metadata/Metadata_BuildingFootprints.md
- **Embedded third-party assets:** No third-party model files, textures, or Sketchfab assets are embedded. The GLB contains locally generated extrusions from public footprint coordinates and height attributes.
- **Scope:** Real lower-Manhattan building footprints in the FiDi envelope filtered to `CONSTRUCTION_YEAR <= 1935` and `HEIGHT_ROOF > 35`, with period landmark spires and distant 1930-1931 Midtown silhouettes added by the generator. Palette is tuned from the local WebDesignerWall Tickerville thumbnail: olive/khaki earth tones, espresso brown, and a clear sky-blue highlight.

## `tickerverse-scene.blend` / `tickerverse-scene.glb`

- **Authoring pipeline:** `scripts/blender/tickerverse_scene.py`
- **Author:** OpenAI Codex for Bon Ayr Industries
- **License:** Generated composition wrapper is MIT. It imports the `period-financial-district.glb` massing above and uses the local Tickerville thumbnail crop for the man placard.
- **Purpose:** Authored Blender scene export with camera, lighting, ground plane, physical ticker-tape ribbons, uneven stamped tape marks, and the Tickerville man placard. React can load this GLB by running Vite with `VITE_TICKERVERSE_AUTHORED_SCENE=1`.
- **Current status:** Pipeline is configured, but Blender must be installed locally before the `.blend` and `.glb` can be exported.

## Licensing Notes

- This pass embeds generated massing derived from NYC Building Footprints coordinate and height data. NYC publishes the dataset for public use under NYC Open Data / NYC.gov terms; those terms are not labeled CC0, CC-BY, or MIT.
- No Sketchfab assets were downloaded or embedded.
