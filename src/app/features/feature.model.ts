export interface Feature {
  id: string;
  geoJSONraw: string;
  projection: string;
  selected: boolean;
  featureOf: string;
}
