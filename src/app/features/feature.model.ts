export interface Feature {
  id: string;
  uri: string;
  featureId: string;
  featureType: string;
  featureName: string;
  featureIdLabel: string;
  geoJSON: [Object];
  selected: boolean;
  parentFeature: string;
  bbox: [number];
  projection: string;
}
