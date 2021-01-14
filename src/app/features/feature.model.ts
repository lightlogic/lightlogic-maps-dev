export interface Feature {
  id: string;
  geoJSONraw: object;
  projection: string;
  selected: boolean;
  featureOf: string;
  featureOfLabel: string;
  featureOfbfsNum: number;
  featureId: string,
  layerBodId: string,
  layerName: string,
  bbox: [number]
}
