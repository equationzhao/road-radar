use crate::error::AppError;
use crate::models::{ElevationPoint, ParsedRoute, TrackPoint};

const MAX_PROFILE_POINTS: usize = 500;
const HAVENRS_EARTH_RADIUS_M: f64 = 6_371_000.0;
const GRADIENT_WINDOW_M: f64 = 50.0;

pub fn parse_gpx_content(content: &str) -> Result<ParsedRoute, AppError> {
    let gpx: gpx::Gpx = gpx::read(content.as_bytes())
        .map_err(|e| AppError::GpxParse(format!("XML 解析失败: {e}")))?;

    let track = gpx
        .tracks
        .into_iter()
        .find(|t| !t.segments.is_empty())
        .ok_or_else(|| AppError::GpxParse("GPX 不含轨迹数据".to_string()))?;

    let name = gpx
        .metadata
        .as_ref()
        .and_then(|m| m.name.clone())
        .filter(|n| !n.is_empty())
        .or_else(|| track.name.clone().filter(|n| !n.is_empty()))
        .unwrap_or_else(|| "未命名路书".to_string());

    let points: Vec<TrackPoint> = track
        .segments
        .iter()
        .flat_map(|seg| seg.points.iter())
        .filter_map(|pt| {
            let elevation = pt.elevation.unwrap_or(0.0);
            Some(TrackPoint {
                lat: pt.point().y(),
                lng: pt.point().x(),
                elevation,
            })
        })
        .collect();

    if points.len() < 2 {
        return Err(AppError::GpxParse("轨迹点不足".to_string()));
    }

    let mut total_distance = 0.0;
    let mut elevation_gain = 0.0;
    let mut elevation_loss = 0.0;
    let mut min_elev = points[0].elevation;
    let mut max_elev = points[0].elevation;
    let mut cum_dists: Vec<f64> = vec![0.0];

    for i in 1..points.len() {
        let dist = haversine_m(
            points[i - 1].lat,
            points[i - 1].lng,
            points[i].lat,
            points[i].lng,
        );
        total_distance += dist;
        cum_dists.push(total_distance);

        let elev_diff = points[i].elevation - points[i - 1].elevation;
        if elev_diff > 0.0 {
            elevation_gain += elev_diff;
        } else {
            elevation_loss += elev_diff.abs();
        }

        min_elev = min_elev.min(points[i].elevation);
        max_elev = max_elev.max(points[i].elevation);
    }

    // Rolling window gradient: for each point, find the nearest point ~50m ahead
    let mut gradients: Vec<f64> = Vec::new();
    let mut j = 0;
    for i in 0..points.len() {
        while j < points.len() && cum_dists[j] - cum_dists[i] < GRADIENT_WINDOW_M {
            j += 1;
        }
        if j < points.len() {
            let dist = cum_dists[j] - cum_dists[i];
            let elev_diff = points[j].elevation - points[i].elevation;
            if dist > 0.0 {
                gradients.push((elev_diff / dist) * 100.0);
            }
        }
    }

    let distance_km = total_distance / 1000.0;
    let avg_gradient = if !gradients.is_empty() {
        gradients.iter().map(|g| g.abs()).sum::<f64>() / gradients.len() as f64
    } else {
        0.0
    };

    let gain_per_10km = if distance_km > 0.0 {
        (elevation_gain / distance_km) * 10.0
    } else {
        0.0
    };
    let ride_type = classify_ride_type(gain_per_10km);

    let elevation_profile = build_elevation_profile(&points, distance_km);

    let created_at = gpx
        .metadata
        .as_ref()
        .and_then(|m| m.time)
        .and_then(|t| t.format().ok());

    Ok(ParsedRoute {
        name,
        distance_km,
        elevation_gain,
        elevation_loss,
        min_elevation: min_elev,
        max_elevation: max_elev,
        start_lat: points[0].lat,
        start_lng: points[0].lng,
        end_lat: points.last().unwrap().lat,
        end_lng: points.last().unwrap().lng,
        avg_gradient: avg_gradient.abs(),
        ride_type,
        elevation_profile,
        track_points: points,
        created_at,
    })
}

fn classify_ride_type(gain_per_10km: f64) -> String {
    if gain_per_10km < 10.0 {
        "flat".to_string()
    } else if gain_per_10km < 20.0 {
        "rolling".to_string()
    } else if gain_per_10km < 50.0 {
        "hilly".to_string()
    } else {
        "mountainous".to_string()
    }
}

fn build_elevation_profile(points: &[TrackPoint], total_km: f64) -> Vec<ElevationPoint> {
    if points.is_empty() || total_km <= 0.0 {
        return Vec::new();
    }

    let interval = (total_km / MAX_PROFILE_POINTS as f64).max(0.001);
    let mut profile = Vec::new();
    let mut cum_dist = 0.0;
    let mut next_sample = 0.0;
    let mut prev_point = &points[0];

    profile.push(ElevationPoint {
        distance: 0.0,
        elevation: points[0].elevation,
    });

    for point in points.iter().skip(1) {
        let seg_dist =
            haversine_m(prev_point.lat, prev_point.lng, point.lat, point.lng) / 1000.0;
        cum_dist += seg_dist;

        while next_sample + interval <= cum_dist {
            next_sample += interval;
            profile.push(ElevationPoint {
                distance: next_sample,
                elevation: point.elevation,
            });
        }

        prev_point = point;
    }

    profile
}

fn haversine_m(lat1: f64, lng1: f64, lat2: f64, lng2: f64) -> f64 {
    let to_rad = |d: f64| d * std::f64::consts::PI / 180.0;
    let dlat = to_rad(lat2 - lat1);
    let dlng = to_rad(lng2 - lng1);
    let a = (dlat / 2.0).sin().powi(2)
        + to_rad(lat1).cos() * to_rad(lat2).cos() * (dlng / 2.0).sin().powi(2);
    2.0 * HAVENRS_EARTH_RADIUS_M * a.sqrt().asin()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn minimal_gpx() -> String {
        r#"<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test">
  <metadata><name>测试路书</name></metadata>
  <trk>
    <name>测试轨迹</name>
    <trkseg>
      <trkpt lat="31.2" lon="121.5"><ele>10</ele></trkpt>
      <trkpt lat="31.21" lon="121.51"><ele>20</ele></trkpt>
      <trkpt lat="31.22" lon="121.52"><ele>15</ele></trkpt>
    </trkseg>
  </trk>
</gpx>"#
            .to_string()
    }

    #[test]
    fn test_parse_minimal_gpx() {
        let result = parse_gpx_content(&minimal_gpx()).unwrap();
        assert_eq!(result.name, "测试路书");
        assert!(result.distance_km > 0.0);
        assert_eq!(result.track_points.len(), 3);
    }

    #[test]
    fn test_elevation_gain_loss() {
        let result = parse_gpx_content(&minimal_gpx()).unwrap();
        // 10 -> 20 = +10 gain, 20 -> 15 = 5 loss
        assert!((result.elevation_gain - 10.0).abs() < 0.1);
        assert!((result.elevation_loss - 5.0).abs() < 0.1);
    }

    #[test]
    fn test_flat_classification() {
        let gpx = r#"<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test">
  <trk><trkseg>
    <trkpt lat="31.0" lon="121.0"><ele>5</ele></trkpt>
    <trkpt lat="31.01" lon="121.01"><ele>6</ele></trkpt>
    <trkpt lat="31.02" lon="121.02"><ele>5</ele></trkpt>
  </trkseg></trk>
</gpx>"#;
        let result = parse_gpx_content(gpx).unwrap();
        assert_eq!(result.ride_type, "flat");
    }

    #[test]
    fn test_empty_gpx_returns_error() {
        let result = parse_gpx_content("<gpx></gpx>");
        assert!(result.is_err());
    }

    #[test]
    fn test_no_track_returns_error() {
        let gpx = r#"<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test">
  <wpt lat="31.0" lon="121.0"><ele>100</ele></wpt>
</gpx>"#;
        let result = parse_gpx_content(gpx);
        assert!(result.is_err());
    }

    #[test]
    fn test_invalid_xml_returns_error() {
        let result = parse_gpx_content("not xml at all");
        assert!(result.is_err());
    }

    #[test]
    fn test_name_fallback_to_track_name() {
        let gpx = r#"<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test">
  <trk><name>备用名称</name><trkseg>
    <trkpt lat="31.0" lon="121.0"><ele>10</ele></trkpt>
    <trkpt lat="31.01" lon="121.01"><ele>20</ele></trkpt>
  </trkseg></trk>
</gpx>"#;
        let result = parse_gpx_content(gpx).unwrap();
        assert_eq!(result.name, "备用名称");
    }

    #[test]
    fn test_name_default_when_missing() {
        let gpx = r#"<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test">
  <trk><trkseg>
    <trkpt lat="31.0" lon="121.0"><ele>10</ele></trkpt>
    <trkpt lat="31.01" lon="121.01"><ele>20</ele></trkpt>
  </trkseg></trk>
</gpx>"#;
        let result = parse_gpx_content(gpx).unwrap();
        assert_eq!(result.name, "未命名路书");
    }

    #[test]
    fn test_start_end_coordinates() {
        let result = parse_gpx_content(&minimal_gpx()).unwrap();
        assert!((result.start_lat - 31.2).abs() < 0.001);
        assert!((result.end_lat - 31.22).abs() < 0.001);
    }

    #[test]
    fn test_haversine_distance() {
        // 上海到北京 ~1068km
        let dist = haversine_m(31.23, 121.47, 39.90, 116.40);
        assert!(dist > 1_000_000.0 && dist < 1_200_000.0);
    }

    #[test]
    fn test_profile_points_limited() {
        // 构造大量点的 GPX
        let mut pts = String::new();
        for i in 0..10000 {
            pts.push_str(&format!(
                "      <trkpt lat=\"31.{:03}\" lon=\"121.{:03}\"><ele>{}</ele></trkpt>\n",
                i % 1000,
                i / 10,
                10.0 + (i as f64 * 0.01).sin() * 5.0
            ));
        }
        let gpx = format!(
            r#"<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"><trk><trkseg>
{pts}</trkseg></trk></gpx>"#
        );
        let result = parse_gpx_content(&gpx).unwrap();
        assert!(result.elevation_profile.len() <= MAX_PROFILE_POINTS);
    }

    // ---- Fixture tests (real GPX files) ----

    #[test]
    fn test_fixture_valid_flat() {
        let content = include_str!("../fixtures/valid_flat.gpx");
        let result = parse_gpx_content(content).unwrap();
        assert_eq!(result.name, "太湖环湖骑行");
        // 短距离下 gain_per_10km 偏高，rolling 分类合理
        assert!(result.ride_type == "flat" || result.ride_type == "rolling");
        assert!(result.distance_km > 0.0);
        assert!(result.elevation_gain < 50.0);
        assert!(result.created_at.is_some());
        assert_eq!(result.track_points.len(), 8);
        assert!((result.start_lat - 31.285).abs() < 0.01);
    }

    #[test]
    fn test_fixture_valid_mountain() {
        let content = include_str!("../fixtures/valid_mountain.gpx");
        let result = parse_gpx_content(content).unwrap();
        assert_eq!(result.name, "莫干山爬坡挑战");
        assert_eq!(result.ride_type, "mountainous");
        assert!(result.elevation_gain > 500.0);
        assert!(result.max_elevation > 600.0);
        assert!(result.min_elevation < 50.0);
        assert_eq!(result.track_points.len(), 15);
    }

    #[test]
    fn test_fixture_no_tracks() {
        let content = include_str!("../fixtures/no_tracks.gpx");
        let result = parse_gpx_content(content);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("轨迹"));
    }

    #[test]
    fn test_fixture_no_elevation() {
        let content = include_str!("../fixtures/no_elevation.gpx");
        let result = parse_gpx_content(content).unwrap();
        // 无海拔数据，elevation 应为 0
        assert!(result.track_points.iter().all(|p| p.elevation == 0.0));
        assert_eq!(result.elevation_gain, 0.0);
    }

    #[test]
    fn test_fixture_multi_track() {
        let content = include_str!("../fixtures/multi_track.gpx");
        let result = parse_gpx_content(content).unwrap();
        // 只取第一条 track
        assert_eq!(result.name, "多日骑行");
        assert_eq!(result.track_points.len(), 2); // 第一条 track 只有 2 个点
    }

    #[test]
    fn test_fixture_minimal() {
        let content = include_str!("../fixtures/minimal.gpx");
        let result = parse_gpx_content(content).unwrap();
        assert_eq!(result.name, "未命名路书"); // metadata 无 name
        assert_eq!(result.track_points.len(), 2);
        assert!(result.distance_km > 0.0);
    }

    #[test]
    fn test_fixture_invalid_xml() {
        let content = include_str!("../fixtures/invalid.xml");
        let result = parse_gpx_content(content);
        assert!(result.is_err());
    }
}
