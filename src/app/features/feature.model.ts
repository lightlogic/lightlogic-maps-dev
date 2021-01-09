export interface Feature {
  id: string;
  uri: string;
  description: string;
  wktGeometry: string;
  geoJSONraw: string;
  projection: string;
  selected: boolean;
}
