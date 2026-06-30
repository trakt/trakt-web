import geoAssetUrl from '../assets/world-countries-50m.topojson?url';

// Minimal GeoJSON shapes (RFC 7946), declared locally so the chart doesn't
// depend on `@types/geojson` (not part of the Deno workspace). Only the polygon
// geometry the country map renders is modelled.
type Position = number[];
type Polygon = { type: 'Polygon'; coordinates: Position[][] };
type MultiPolygon = { type: 'MultiPolygon'; coordinates: Position[][][] };
type Feature<G, P> = {
  type: 'Feature';
  id?: string | number;
  geometry: G;
  properties: P;
};
type FeatureCollection<G, P> = {
  type: 'FeatureCollection';
  features: Feature<G, P>[];
};

export type CountryFeatureProperties = { code: string };
export type CountryFeature = Feature<
  Polygon | MultiPolygon,
  CountryFeatureProperties
>;
export type CountryFeatureCollection = FeatureCollection<
  Polygon | MultiPolygon,
  CountryFeatureProperties
>;

// Minimal shape of the quantized TopoJSON asset we ship. Decoding it inline
// avoids pulling in `topojson-client` (only a transitive dep) just to turn the
// topology into GeoJSON the d3 geo path can render.
type Topology = {
  transform: { scale: [number, number]; translate: [number, number] };
  arcs: Position[][];
  objects: {
    countries: { geometries: TopoGeometry[] };
  };
};

type TopoGeometry =
  | { type: 'Polygon'; arcs: number[][]; properties: { NAME: string } }
  | { type: 'MultiPolygon'; arcs: number[][][]; properties: { NAME: string } };

// Single-slot cache: the asset URL is a build-time constant, so one in-flight
// promise is memoised and cleared on failure to allow a retry.
let cached: Promise<CountryFeatureCollection> | undefined;

// Each arc point is delta-encoded from the previous one (first delta is from the
// origin); a negative index references the arc traversed in reverse.
function decodeArc(topology: Topology, index: number): Position[] {
  const reversed = index < 0;
  const arc = topology.arcs[reversed ? ~index : index];
  const [scaleX, scaleY] = topology.transform.scale;
  const [translateX, translateY] = topology.transform.translate;

  let x = 0;
  let y = 0;
  const points = arc.map(([deltaX, deltaY]) => {
    x += deltaX;
    y += deltaY;
    return [x * scaleX + translateX, y * scaleY + translateY] as Position;
  });

  return reversed ? points.reverse() : points;
}

// Stitch a ring's arcs, dropping the point shared where consecutive arcs join.
function buildRing(topology: Topology, arcIndices: number[]): Position[] {
  return arcIndices.flatMap((index, order) => {
    const points = decodeArc(topology, index);
    return order > 0 ? points.slice(1) : points;
  });
}

function buildPolygon(topology: Topology, rings: number[][]): Position[][] {
  return rings.map((ring) => buildRing(topology, ring));
}

function toFeature(topology: Topology, geometry: TopoGeometry): CountryFeature {
  const properties = { code: geometry.properties.NAME };

  const shape: Polygon | MultiPolygon = geometry.type === 'MultiPolygon'
    ? {
      type: 'MultiPolygon',
      coordinates: geometry.arcs.map((polygon) =>
        buildPolygon(topology, polygon)
      ),
    }
    : {
      type: 'Polygon',
      coordinates: buildPolygon(topology, geometry.arcs),
    };

  return { type: 'Feature', id: properties.code, properties, geometry: shape };
}

function decode(topology: Topology): CountryFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: topology.objects.countries.geometries.map((geometry) =>
      toFeature(topology, geometry)
    ),
  };
}

export function loadCountryFeatures(): Promise<CountryFeatureCollection> {
  if (cached) return cached;

  cached = fetch(geoAssetUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch map geometry: ${response.statusText}`,
        );
      }
      return response.json() as Promise<Topology>;
    })
    .then(decode)
    .catch((error) => {
      console.error('Failed to load country map geometry:', error);
      // Drop the rejected promise so a remount can retry instead of
      // permanently serving the cached failure.
      cached = undefined;
      throw error;
    });

  return cached;
}
