use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParsedRoute {
    pub name: String,
    pub distance_km: f64,
    pub elevation_gain: f64,
    pub elevation_loss: f64,
    pub min_elevation: f64,
    pub max_elevation: f64,
    pub start_lat: f64,
    pub start_lng: f64,
    pub end_lat: f64,
    pub end_lng: f64,
    pub avg_gradient: f64,
    pub ride_type: String,
    pub elevation_profile: Vec<ElevationPoint>,
    pub track_points: Vec<TrackPoint>,
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrackPoint {
    pub lat: f64,
    pub lng: f64,
    pub elevation: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ElevationPoint {
    pub distance: f64,
    pub elevation: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SavedRoute {
    pub id: String,
    pub name: String,
    pub location: String,
    pub city: String,
    pub distance_km: f64,
    pub elevation_gain: f64,
    pub elevation_loss: f64,
    pub max_gradient: f64,
    pub avg_gradient: f64,
    pub min_elevation: f64,
    pub max_elevation: f64,
    pub difficulty: i32,
    pub ride_type: String,
    pub ride_count: i32,
    pub last_ridden: Option<String>,
    pub import_date: String,
    pub cover_color: String,
    pub description: String,
    pub tags: Vec<String>,
}
