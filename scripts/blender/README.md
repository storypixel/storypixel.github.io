# Tickerverse Blender Scene Pipeline

This folder is the handoff point from React/R3F tinkering to a real authored
3D scene.

## Goal

Blender becomes the scene editor and exporter:

- Import the NYC FiDi period massing GLB.
- Place the old Tickerville man photo as a grounded placard.
- Build physical ticker-tape ribbons with uneven stamped marks.
- Author camera, lighting, fog, shadows, and composition in one place.
- Export `public/models/tickerverse/tickerverse-scene.glb`.

React then only loads the exported scene when
`VITE_TICKERVERSE_AUTHORED_SCENE=1` is enabled.

## Requirements

Install Blender so the `blender` binary is available on `PATH`.

On macOS, one common path is:

```sh
brew install --cask blender
```

If the binary is not linked, either add Blender to `PATH` or replace `blender`
in the npm script with:

```sh
/Applications/Blender.app/Contents/MacOS/Blender
```

## Export

From the repo root:

```sh
npm run tickerverse:blender
```

That writes:

- `public/models/tickerverse/tickerverse-scene.blend`
- `public/models/tickerverse/tickerverse-scene.glb`

## Preview Authored Scene

After export, run:

```sh
npm run dev:tickerverse-authored
```

Then open:

```text
http://localhost:5173/clients/tickerverse
```

If another Vite server is already running, Vite will choose the next free port.

## Current Inputs

- `public/models/tickerverse/period-financial-district.glb`
- `public/images/tickerverse/tickerville-man-photo.png`

The script is deterministic by default with seed `1929`, so exported tape
positions remain stable between runs unless `--seed` changes.
