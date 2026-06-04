import { invoke } from "@tauri-apps/api/core";

export interface TrackPoint {
  lat: number;
  lng: number;
  elevation: number;
}

export interface ElevationPoint {
  distance: number;
  elevation: number;
}

export interface ParsedRoute {
  name: string;
  distance_km: number;
  elevation_gain: number;
  elevation_loss: number;
  min_elevation: number;
  max_elevation: number;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  max_gradient: number;
  avg_gradient: number;
  ride_type: string;
  elevation_profile: ElevationPoint[];
  track_points: TrackPoint[];
  created_at: string | null;
}

export async function parseGpx(filePath: string): Promise<ParsedRoute> {
  return invoke<ParsedRoute>("parse_gpx", { filePath });
}
