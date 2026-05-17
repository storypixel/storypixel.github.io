import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    });
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${
        Buffer.from(buffer).toString('base64')
      }`;
      this.onloadend?.();
    });
  }
};

const outDir = path.join(process.cwd(), 'public/models/tickerverse');
const outPath = path.join(outDir, 'period-financial-district.glb');

const scene = new THREE.Scene();
scene.name = 'TickerversePeriodFinancialDistrict';

const district = new THREE.Group();
district.name = 'PeriodFinancialDistrict_1925_1935';
scene.add(district);

const makeMaterial = (name, color, roughness = 0.94, metalness = 0.03) => {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
  });
  material.name = name;
  return material;
};

const materials = {
  limestone: makeMaterial('aged-olive-limestone', '#938F6E'),
  darkStone: makeMaterial('espresso-brownstone', '#322A29'),
  warmStone: makeMaterial('moss-khaki-stone', '#67634F'),
  bronze: makeMaterial('old-bronze', '#4A443C', 0.86, 0.18),
  copper: makeMaterial('blue-gray-patina', '#708B99', 0.88, 0.12),
  roof: makeMaterial('deep-brown-roof', '#322A29', 0.92, 0.02),
  window: makeMaterial('unlit-window-bands', '#2A2324', 0.78, 0.02),
  street: makeMaterial('brown-cobble-street', '#4A443C'),
  ground: makeMaterial('olive-harbor-ground', '#67634F'),
  rail: makeMaterial('cool-streetcar-rail', '#708B99', 0.62, 0.34),
  haze: makeMaterial('old-paper-haze-stone', '#C8C6AD'),
  skyBlue: makeMaterial('clear-sky-blue-highlight', '#9ACAE8', 0.82, 0.02),
  realLow: makeMaterial('real-footprint-olive-lowrise', '#827D61'),
  realMid: makeMaterial('real-footprint-khaki-midrise', '#67634F'),
  realTall: makeMaterial('real-footprint-espresso-tower', '#4A443C'),
  realLandmark: makeMaterial('real-footprint-dark-landmark', '#322A29'),
};

const FIDI_BOUNDS = {
  west: -74.0155,
  south: 40.701,
  east: -73.9985,
  north: 40.7138,
};

const GEO_CENTER = {
  lon: (FIDI_BOUNDS.west + FIDI_BOUNDS.east) / 2,
  lat: (FIDI_BOUNDS.south + FIDI_BOUNDS.north) / 2,
};

const FEET_PER_UNIT = 85;
const LAT_FEET_PER_DEGREE = 364000;
const LON_FEET_PER_DEGREE = LAT_FEET_PER_DEGREE * Math.cos(THREE.MathUtils.degToRad(GEO_CENTER.lat));

function geoToScene(lon, lat) {
  return {
    x: ((lon - GEO_CENTER.lon) * LON_FEET_PER_DEGREE) / FEET_PER_UNIT,
    z: -((lat - GEO_CENTER.lat) * LAT_FEET_PER_DEGREE) / FEET_PER_UNIT,
  };
}

function addBox(parent, name, position, scale, material = materials.limestone) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 1, 0.018), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  parent.add(mesh);
  return mesh;
}

function addSharpBox(parent, name, position, scale, material = materials.limestone) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  parent.add(mesh);
  return mesh;
}

function addCylinder(parent, name, position, radius, height, material, segments = 16) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, segments),
    material,
  );
  mesh.name = name;
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function addCone(parent, name, position, radius, height, material, segments = 4, rotationY = Math.PI / 4) {
  const mesh = new THREE.Mesh(new THREE.ConeGeometry(radius, height, segments), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.y = rotationY;
  parent.add(mesh);
  return mesh;
}

function addFacadeBands(parent, name, x, z, width, depth, minY, maxY, count, side = 'front') {
  const bandGroup = new THREE.Group();
  bandGroup.name = `${name}_facade_relief`;
  const step = (maxY - minY) / count;
  const columns = Math.max(3, Math.floor((side === 'front' ? width : depth) / 0.48));
  const columnStep = (side === 'front' ? width : depth) / columns;

  for (let c = 1; c < columns; c += 1) {
    const offset = -((side === 'front' ? width : depth) / 2) + columnStep * c;

    if (side === 'front') {
      addSharpBox(
        bandGroup,
        `${name}_front_pilaster_${c}`,
        [x + offset, (minY + maxY) / 2, z + depth / 2 + 0.026],
        [0.032, maxY - minY + 0.16, 0.032],
        materials.bronze,
      );
    } else {
      addSharpBox(
        bandGroup,
        `${name}_side_pilaster_${c}`,
        [x + width / 2 + 0.026, (minY + maxY) / 2, z + offset],
        [0.032, maxY - minY + 0.16, 0.032],
        materials.bronze,
      );
    }
  }

  for (let i = 0; i < count; i += 1) {
    const y = minY + step * i;

    for (let c = 0; c < columns; c += 1) {
      if ((i + c) % 7 === 0) continue;

      const offset = -((side === 'front' ? width : depth) / 2) + columnStep * (c + 0.5);
      const windowWidth = Math.min(0.18, columnStep * 0.45);

      if (side === 'front') {
        addSharpBox(
          bandGroup,
          `${name}_front_window_${i}_${c}`,
          [x + offset, y, z + depth / 2 + 0.045],
          [windowWidth, 0.075, 0.025],
          materials.window,
        );
      } else {
        addSharpBox(
          bandGroup,
          `${name}_side_window_${i}_${c}`,
          [x + width / 2 + 0.045, y, z + offset],
          [0.025, 0.075, windowWidth],
          materials.window,
        );
      }
    }

    if (side === 'front') {
      addSharpBox(
        bandGroup,
        `${name}_front_sill_${i}`,
        [x, y - 0.08, z + depth / 2 + 0.03],
        [width * 0.74, 0.018, 0.026],
        materials.bronze,
      );
    } else {
      addSharpBox(
        bandGroup,
        `${name}_side_sill_${i}`,
        [x + width / 2 + 0.03, y - 0.08, z],
        [0.026, 0.018, depth * 0.74],
        materials.bronze,
      );
    }
  }

  parent.add(bandGroup);
}

function addCornice(parent, name, x, z, y, width, depth, material = materials.bronze) {
  addSharpBox(parent, `${name}_cornice_front_${y.toFixed(2)}`, [x, y, z + depth / 2 + 0.08], [width + 0.28, 0.11, 0.12], material);
  addSharpBox(parent, `${name}_cornice_back_${y.toFixed(2)}`, [x, y, z - depth / 2 - 0.08], [width + 0.28, 0.11, 0.12], material);
  addSharpBox(parent, `${name}_cornice_left_${y.toFixed(2)}`, [x - width / 2 - 0.08, y, z], [0.12, 0.11, depth + 0.28], material);
  addSharpBox(parent, `${name}_cornice_right_${y.toFixed(2)}`, [x + width / 2 + 0.08, y, z], [0.12, 0.11, depth + 0.28], material);
}

function addSetbackTower(parent, name, x, z, levels, material = materials.limestone) {
  const tower = new THREE.Group();
  tower.name = name;
  let y = 0;

  levels.forEach((level, index) => {
    const tierBaseY = y;
    const mesh = addBox(
      tower,
      `${name}_tier_${index}`,
      [x, y + level.height / 2, z],
      [level.width, level.height, level.depth],
      level.material || material,
    );
    mesh.userData = { building: name };
    y += level.height;

    if (level.cornice !== false) {
      addCornice(
        tower,
        `${name}_tier_${index}`,
        x,
        z,
        tierBaseY + level.height + 0.02,
        level.width,
        level.depth,
        level.corniceMaterial || materials.bronze,
      );
    }
  });

  parent.add(tower);
  return { group: tower, top: y };
}

function addCrown(parent, name, x, z, top, radius, material = materials.roof) {
  addCone(parent, `${name}_pyramid_crown`, [x, top + radius * 0.48, z], radius, radius * 0.95, material);
}

function addSpire(parent, name, x, z, baseY, height, radius = 0.06, material = materials.bronze) {
  addCylinder(parent, `${name}_spire_shaft`, [x, baseY + height * 0.42, z], radius, height * 0.84, material, 10);
  addCone(parent, `${name}_spire_point`, [x, baseY + height * 0.91, z], radius * 2.1, height * 0.18, material, 12, 0);
}

function addRooftopTank(parent, name, x, z, y, scale = 1) {
  addCylinder(parent, `${name}_water_tank`, [x, y + 0.22 * scale, z], 0.16 * scale, 0.38 * scale, materials.bronze, 14);
  addCone(parent, `${name}_water_tank_roof`, [x, y + 0.48 * scale, z], 0.18 * scale, 0.16 * scale, materials.roof, 14, 0);
  addSharpBox(parent, `${name}_tank_leg_a`, [x - 0.11 * scale, y + 0.02 * scale, z - 0.11 * scale], [0.025 * scale, 0.24 * scale, 0.025 * scale], materials.bronze);
  addSharpBox(parent, `${name}_tank_leg_b`, [x + 0.11 * scale, y + 0.02 * scale, z - 0.11 * scale], [0.025 * scale, 0.24 * scale, 0.025 * scale], materials.bronze);
  addSharpBox(parent, `${name}_tank_leg_c`, [x - 0.11 * scale, y + 0.02 * scale, z + 0.11 * scale], [0.025 * scale, 0.24 * scale, 0.025 * scale], materials.bronze);
  addSharpBox(parent, `${name}_tank_leg_d`, [x + 0.11 * scale, y + 0.02 * scale, z + 0.11 * scale], [0.025 * scale, 0.24 * scale, 0.025 * scale], materials.bronze);
}

function addRadioMast(parent, name, x, z, y, height = 1.1) {
  addCylinder(parent, `${name}_mast`, [x, y + height / 2, z], 0.025, height, materials.bronze, 8);
  addSharpBox(parent, `${name}_crossbar_low`, [x, y + height * 0.42, z], [0.52, 0.025, 0.025], materials.bronze);
  addSharpBox(parent, `${name}_crossbar_high`, [x, y + height * 0.68, z], [0.38, 0.025, 0.025], materials.bronze);
}

function addGeoRoad(parent, name, start, end, width, material = materials.street) {
  const a = geoToScene(start.lon, start.lat);
  const b = geoToScene(end.lon, end.lat);
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const length = Math.hypot(dx, dz);
  const mesh = addSharpBox(
    parent,
    name,
    [(a.x + b.x) / 2, 0.025, (a.z + b.z) / 2],
    [length, 0.05, width],
    material,
  );
  mesh.rotation.y = Math.atan2(-dz, dx);
  return mesh;
}

function ringArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    area += a.x * b.y - b.x * a.y;
  }
  return area / 2;
}

function simplifyRing(ring, minDistance = 0.06) {
  const points = [];
  ring.forEach(([lon, lat], index) => {
    if (index === ring.length - 1) return;
    const point = geoToScene(lon, lat);
    const prev = points[points.length - 1];
    if (!prev || Math.hypot(point.x - prev.x, point.z - prev.y) > minDistance) {
      points.push(new THREE.Vector2(point.x, point.z));
    }
  });
  return points;
}

function materialForHeight(heightFeet) {
  if (heightFeet > 520) return materials.realLandmark;
  if (heightFeet > 260) return materials.realTall;
  if (heightFeet > 120) return materials.realMid;
  return materials.realLow;
}

function addFootprintMesh(parent, feature) {
  const { geometry, properties } = feature;
  const heightFeet = Number(properties.HEIGHT_ROOF || 0);
  const height = Math.max(0.28, heightFeet / FEET_PER_UNIT);
  const polygons = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];

  polygons.forEach((polygon, polygonIndex) => {
    const outer = simplifyRing(polygon[0]);
    if (outer.length < 3 || Math.abs(ringArea(outer)) < 0.012) return;
    if (ringArea(outer) < 0) outer.reverse();

    const shape = new THREE.Shape(outer);

    polygon.slice(1).forEach((holeRing) => {
      const hole = simplifyRing(holeRing);
      if (hole.length < 3 || Math.abs(ringArea(hole)) < 0.01) return;
      if (ringArea(hole) > 0) hole.reverse();
      shape.holes.push(new THREE.Path(hole));
    });

    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: heightFeet > 100,
      bevelThickness: heightFeet > 260 ? 0.018 : 0.01,
      bevelSize: heightFeet > 260 ? 0.018 : 0.01,
      bevelSegments: 1,
      curveSegments: 1,
    });
    extrude.rotateX(-Math.PI / 2);
    extrude.computeVertexNormals();

    const mesh = new THREE.Mesh(extrude, materialForHeight(heightFeet));
    mesh.name = `nyc_footprint_${properties.DOITT_ID}_${polygonIndex}_${properties.CONSTRUCTION_YEAR}`;
    mesh.userData = {
      doittId: properties.DOITT_ID,
      constructionYear: properties.CONSTRUCTION_YEAR,
      heightRoofFeet: heightFeet,
      source: 'NYC Building Footprints FeatureServer',
    };
    parent.add(mesh);
  });
}

function addGeoSpire(parent, name, lon, lat, baseFeet, heightFeet, material = materials.roof) {
  const point = geoToScene(lon, lat);
  addSpire(parent, name, point.x, point.z, baseFeet / FEET_PER_UNIT, heightFeet / FEET_PER_UNIT, 0.04, material);
}

async function fetchFidiFootprints() {
  const params = new URLSearchParams({
    where: 'CONSTRUCTION_YEAR > 0 AND CONSTRUCTION_YEAR <= 1935 AND HEIGHT_ROOF > 35',
    geometry: JSON.stringify({
      xmin: FIDI_BOUNDS.west,
      ymin: FIDI_BOUNDS.south,
      xmax: FIDI_BOUNDS.east,
      ymax: FIDI_BOUNDS.north,
      spatialReference: { wkid: 4326 },
    }),
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'DOITT_ID,NAME,HEIGHT_ROOF,CONSTRUCTION_YEAR',
    returnGeometry: 'true',
    outSR: '4326',
    f: 'geojson',
    resultRecordCount: '2000',
  });

  const url = `https://services6.arcgis.com/yG5s3afENB5iO9fj/arcgis/rest/services/BUILDING_view/FeatureServer/0/query?${params}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NYC footprint query failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.features)) {
    throw new Error('NYC footprint query returned no features array');
  }
  return data.features;
}

async function addRealFinancialDistrict(parent) {
  const realDistrict = new THREE.Group();
  realDistrict.name = 'NYC_OpenData_FiDi_Pre1935_Extruded_Massing';

  addSharpBox(realDistrict, 'fidi_ground_plane', [0, -0.08, 0], [62, 0.16, 50], materials.ground);
  addGeoRoad(realDistrict, 'broadway_period_road', { lon: -74.0148, lat: 40.7042 }, { lon: -74.0102, lat: 40.7136 }, 0.92);
  addGeoRoad(realDistrict, 'wall_street_period_road', { lon: -74.0124, lat: 40.7073 }, { lon: -74.0058, lat: 40.7064 }, 0.78);
  addGeoRoad(realDistrict, 'broad_street_period_road', { lon: -74.011, lat: 40.7068 }, { lon: -74.0092, lat: 40.7012 }, 0.82);
  addGeoRoad(realDistrict, 'water_street_period_road', { lon: -74.0072, lat: 40.7011 }, { lon: -74.002, lat: 40.7132 }, 0.76);
  addGeoRoad(realDistrict, 'beaver_street_period_road', { lon: -74.0118, lat: 40.7044 }, { lon: -74.0064, lat: 40.7041 }, 0.68);
  addGeoRoad(realDistrict, 'sky_blue_wall_street_glint', { lon: -74.0116, lat: 40.707 }, { lon: -74.007, lat: 40.7063 }, 0.16, materials.skyBlue);

  const features = await fetchFidiFootprints();
  features
    .sort((a, b) => Number(a.properties.HEIGHT_ROOF || 0) - Number(b.properties.HEIGHT_ROOF || 0))
    .forEach((feature) => addFootprintMesh(realDistrict, feature));

  addGeoSpire(realDistrict, 'forty_wall_street_1930', -74.0092, 40.7069, 927, 90, materials.copper);
  addGeoSpire(realDistrict, 'seventy_pine_1932', -74.0078, 40.7065, 952, 120, materials.bronze);
  addGeoSpire(realDistrict, 'trinity_church_1846', -74.0123, 40.7081, 230, 80, materials.roof);
  addGeoSpire(realDistrict, 'bankers_trust_1912', -74.0094, 40.7073, 540, 70, materials.roof);

  realDistrict.userData = {
    source: 'NYC Building Footprints FeatureServer',
    featureCount: features.length,
    filter: 'construction year <= 1935, height roof > 35 ft, lower Manhattan envelope',
  };

  parent.add(realDistrict);
}

function addStreetGrid(parent) {
  addBox(parent, 'lower_manhattan_ground_plane', [0, -0.08, -1], [42, 0.16, 32], materials.ground);

  addBox(parent, 'wall_street_cobble_run', [2, 0.02, -1.7], [31, 0.05, 1.15], materials.street);
  addBox(parent, 'broad_street_cobble_run', [0.2, 0.025, -0.5], [1.18, 0.05, 25], materials.street);
  addBox(parent, 'broadway_cobble_run', [-8.4, 0.025, -0.4], [1.05, 0.05, 25], materials.street);
  addBox(parent, 'water_street_cobble_run', [13.8, 0.025, -2.7], [1.0, 0.05, 22], materials.street);
  addBox(parent, 'beaver_street_cobble_run', [3.8, 0.03, 5.2], [21, 0.05, 0.9], materials.street);

  [-0.1, 0.28].forEach((x, i) => {
    addBox(parent, `broad_streetcar_rail_${i}`, [x, 0.08, -0.5], [0.045, 0.055, 22], materials.rail);
  });
  [-1.91, -1.48].forEach((z, i) => {
    addBox(parent, `wall_streetcar_rail_${i}`, [2, 0.08, z], [27, 0.055, 0.045], materials.rail);
  });

  addBox(parent, 'clear_sky_blue_exchange_board', [-6.25, 1.55, -1.0], [4.8, 2.05, 0.06], materials.skyBlue);
  addBox(parent, 'clear_sky_blue_floor_glint', [4.8, 0.11, -1.7], [9.2, 0.07, 0.18], materials.skyBlue);
}

function addNamedBuildings(parent) {
  addStreetGrid(parent);

  const trinity = new THREE.Group();
  trinity.name = 'Trinity_Church_1846';
  addBox(trinity, 'trinity_nave', [-8.6, 0.85, -1.2], [2.2, 1.7, 4.0], materials.darkStone);
  addBox(trinity, 'trinity_tower', [-8.6, 2.15, 1.05], [1.0, 2.6, 1.0], materials.darkStone);
  addCone(trinity, 'trinity_steeple_roof', [-8.6, 4.05, 1.05], 0.65, 1.2, materials.roof, 8, 0);
  addSpire(trinity, 'trinity_needle', -8.6, 1.05, 4.4, 0.9, 0.035, materials.roof);
  addBox(trinity, 'trinity_cross_vertical', [-8.6, 5.3, 1.05], [0.045, 0.45, 0.045], materials.roof);
  addBox(trinity, 'trinity_cross_horizontal', [-8.6, 5.38, 1.05], [0.34, 0.045, 0.045], materials.roof);
  parent.add(trinity);

  const equitable = addSetbackTower(parent, 'Equitable_Building_1915', -3.9, -7.0, [
    { width: 5.6, depth: 4.2, height: 3.3, material: materials.warmStone },
    { width: 5.2, depth: 3.9, height: 2.6, material: materials.warmStone },
    { width: 4.6, depth: 3.5, height: 1.4, material: materials.limestone },
  ]);
  addFacadeBands(equitable.group, 'equitable', -3.9, -7.0, 5.6, 4.2, 0.8, 6.4, 16, 'front');
  addFacadeBands(equitable.group, 'equitable', -3.9, -7.0, 5.6, 4.2, 0.8, 6.0, 12, 'side');
  addRooftopTank(equitable.group, 'equitable_roof', -5.25, -6.05, equitable.top + 0.1, 1.05);
  addRadioMast(equitable.group, 'equitable_roof', -2.15, -7.85, equitable.top + 0.04, 1.4);

  const standardOil = addSetbackTower(parent, 'TwentySix_Broadway_Standard_Oil_1922', -8.7, 4.2, [
    { width: 4.6, depth: 3.8, height: 2.9, material: materials.limestone },
    { width: 3.4, depth: 2.9, height: 2.4, material: materials.warmStone },
    { width: 1.8, depth: 1.8, height: 1.4, material: materials.limestone },
  ]);
  addCrown(standardOil.group, 'standard_oil', -8.7, 4.2, standardOil.top, 1.05, materials.roof);
  addFacadeBands(standardOil.group, 'standard_oil', -8.7, 4.2, 4.6, 3.8, 0.8, 5.7, 12, 'front');
  addFacadeBands(standardOil.group, 'standard_oil', -8.7, 4.2, 4.6, 3.8, 0.8, 5.4, 10, 'side');

  const cunard = addSetbackTower(parent, 'Cunard_Building_1921', -4.8, 5.7, [
    { width: 3.6, depth: 2.5, height: 2.6, material: materials.warmStone },
    { width: 3.1, depth: 2.0, height: 0.9, material: materials.limestone },
  ]);
  addCylinder(cunard.group, 'cunard_roof_cupola_west', [-5.55, cunard.top + 0.38, 5.7], 0.25, 0.75, materials.copper, 12);
  addCylinder(cunard.group, 'cunard_roof_cupola_east', [-4.05, cunard.top + 0.38, 5.7], 0.25, 0.75, materials.copper, 12);
  addCone(cunard.group, 'cunard_cupola_west_cap', [-5.55, cunard.top + 0.85, 5.7], 0.28, 0.32, materials.copper, 12, 0);
  addCone(cunard.group, 'cunard_cupola_east_cap', [-4.05, cunard.top + 0.85, 5.7], 0.28, 0.32, materials.copper, 12, 0);
  addFacadeBands(cunard.group, 'cunard', -4.8, 5.7, 3.6, 2.5, 0.7, 3.0, 6, 'front');

  const fed = addSetbackTower(parent, 'Federal_Reserve_Bank_of_New_York_1924', -1.9, 2.7, [
    { width: 4.9, depth: 3.2, height: 2.6, material: materials.darkStone },
    { width: 4.4, depth: 2.8, height: 1.3, material: materials.darkStone },
  ]);
  addFacadeBands(fed.group, 'federal_reserve', -1.9, 2.7, 4.9, 3.2, 0.9, 3.5, 7, 'front');
  addFacadeBands(fed.group, 'federal_reserve', -1.9, 2.7, 4.9, 3.2, 0.9, 3.3, 6, 'side');

  const bankers = addSetbackTower(parent, 'Bankers_Trust_Building_1912', 1.8, 3.2, [
    { width: 2.8, depth: 2.8, height: 4.5, material: materials.limestone },
    { width: 2.1, depth: 2.1, height: 1.2, material: materials.limestone },
    { width: 1.45, depth: 1.45, height: 0.9, material: materials.warmStone },
  ]);
  addCrown(bankers.group, 'bankers_trust', 1.8, 3.2, bankers.top, 0.8, materials.roof);
  addFacadeBands(bankers.group, 'bankers_trust', 1.8, 3.2, 2.8, 2.8, 0.8, 5.8, 13, 'front');
  addFacadeBands(bankers.group, 'bankers_trust', 1.8, 3.2, 2.8, 2.8, 0.8, 5.4, 11, 'side');

  const wall40 = addSetbackTower(parent, 'Forty_Wall_Street_1930', 2.5, -2.6, [
    { width: 3.5, depth: 3.2, height: 4.1, material: materials.warmStone },
    { width: 2.7, depth: 2.5, height: 2.6, material: materials.limestone },
    { width: 1.9, depth: 1.8, height: 1.9, material: materials.limestone },
    { width: 1.15, depth: 1.1, height: 1.25, material: materials.warmStone },
  ]);
  addCrown(wall40.group, 'forty_wall', 2.5, -2.6, wall40.top, 0.78, materials.copper);
  addSpire(wall40.group, 'forty_wall', 2.5, -2.6, wall40.top + 0.58, 1.8, 0.055, materials.copper);
  addFacadeBands(wall40.group, 'forty_wall', 2.5, -2.6, 3.5, 3.2, 0.9, 8.6, 19, 'front');
  addFacadeBands(wall40.group, 'forty_wall', 2.5, -2.6, 3.5, 3.2, 1.0, 7.8, 14, 'side');

  const marine = addSetbackTower(parent, 'Marine_Midland_1932', 5.8, 2.5, [
    { width: 2.2, depth: 2.5, height: 3.6, material: materials.limestone },
    { width: 1.7, depth: 2.0, height: 1.4, material: materials.warmStone },
    { width: 1.25, depth: 1.45, height: 0.8, material: materials.limestone },
  ]);
  addFacadeBands(marine.group, 'marine_midland', 5.8, 2.5, 2.2, 2.5, 0.8, 5.2, 12, 'front');
  addRooftopTank(marine.group, 'marine_midland_roof', 5.35, 1.75, marine.top + 0.06, 0.78);

  const wall120 = addSetbackTower(parent, 'OneTwenty_Wall_Street_1930', 10.7, -0.7, [
    { width: 3.4, depth: 2.4, height: 3.2, material: materials.warmStone },
    { width: 2.6, depth: 1.9, height: 1.1, material: materials.limestone },
  ]);
  addFacadeBands(wall120.group, 'one_twenty_wall', 10.7, -0.7, 3.4, 2.4, 0.7, 3.9, 8, 'front');
  addFacadeBands(wall120.group, 'one_twenty_wall', 10.7, -0.7, 3.4, 2.4, 0.7, 3.7, 7, 'side');

  const pine70 = addSetbackTower(parent, 'Seventy_Pine_Cities_Service_1932', 8.3, -5.1, [
    { width: 2.6, depth: 2.9, height: 4.2, material: materials.darkStone },
    { width: 2.1, depth: 2.3, height: 2.7, material: materials.warmStone },
    { width: 1.5, depth: 1.65, height: 2.0, material: materials.limestone },
    { width: 0.9, depth: 1.0, height: 1.25, material: materials.limestone },
  ]);
  addCone(pine70.group, 'seventy_pine_lantern_cap', [8.3, pine70.top + 0.36, -5.1], 0.58, 0.72, materials.roof, 8, 0);
  addSpire(pine70.group, 'seventy_pine', 8.3, -5.1, pine70.top + 0.56, 2.1, 0.045, materials.bronze);
  addFacadeBands(pine70.group, 'seventy_pine', 8.3, -5.1, 2.6, 2.9, 0.8, 9.2, 21, 'front');
  addFacadeBands(pine70.group, 'seventy_pine', 8.3, -5.1, 2.6, 2.9, 0.8, 8.0, 15, 'side');
}

function addDistantLandmarks(parent) {
  const skyline = new THREE.Group();
  skyline.name = 'Distant_Midtown_1930_1931_Horizon';

  const chrysler = addSetbackTower(skyline, 'Chrysler_Building_1930_silhouette', -14.4, -16.4, [
    { width: 1.8, depth: 1.7, height: 5.6, material: materials.haze },
    { width: 1.35, depth: 1.28, height: 2.5, material: materials.haze },
    { width: 0.95, depth: 0.9, height: 1.45, material: materials.haze },
  ]);
  addCone(chrysler.group, 'chrysler_tiered_crown', [-14.4, chrysler.top + 0.55, -16.4], 0.72, 1.1, materials.copper, 16, 0);
  addSpire(chrysler.group, 'chrysler', -14.4, -16.4, chrysler.top + 1.05, 1.35, 0.035, materials.copper);

  const empire = addSetbackTower(skyline, 'Empire_State_Building_1931_silhouette', -18.3, -17.7, [
    { width: 2.15, depth: 1.9, height: 6.8, material: materials.haze },
    { width: 1.55, depth: 1.45, height: 2.75, material: materials.haze },
    { width: 0.95, depth: 0.9, height: 1.45, material: materials.haze },
  ]);
  addSpire(empire.group, 'empire_state', -18.3, -17.7, empire.top, 1.9, 0.05, materials.roof);

  parent.add(skyline);
}

await addRealFinancialDistrict(district);
addDistantLandmarks(district);

district.rotation.y = -0.2;
district.rotation.x = 0.015;
district.position.set(0, 0, 0);
district.userData = {
  period: '1925-1935',
  place: 'Lower Manhattan Financial District',
  asset: 'Original low-poly interpretive GLB; no third-party geometry or textures embedded.',
};

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(scene, {
  binary: true,
  onlyVisible: true,
  trs: false,
});

await mkdir(outDir, { recursive: true });
await writeFile(outPath, Buffer.from(glb));
console.log(`Wrote ${outPath} (${Buffer.byteLength(Buffer.from(glb))} bytes)`);
