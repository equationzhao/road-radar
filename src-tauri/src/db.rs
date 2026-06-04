use tauri_plugin_sql::{Migration, MigrationKind};

pub fn migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_routes_and_tags_tables",
        sql: "CREATE TABLE IF NOT EXISTS routes (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                location TEXT DEFAULT '',
                city TEXT DEFAULT '',
                distance_km REAL NOT NULL,
                elevation_gain REAL NOT NULL,
                elevation_loss REAL NOT NULL,
                max_gradient REAL DEFAULT 0,
                avg_gradient REAL DEFAULT 0,
                min_elevation REAL DEFAULT 0,
                max_elevation REAL DEFAULT 0,
                difficulty INTEGER DEFAULT 0,
                ride_type TEXT DEFAULT 'flat',
                ride_count INTEGER DEFAULT 0,
                last_ridden TEXT,
                import_date TEXT NOT NULL,
                cover_color TEXT DEFAULT '#f59e0b',
                description TEXT DEFAULT '',
                gpx_content TEXT NOT NULL
              );
              CREATE TABLE IF NOT EXISTS tags (
                route_id TEXT NOT NULL,
                tag TEXT NOT NULL,
                PRIMARY KEY (route_id, tag),
                FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
              );",
        kind: MigrationKind::Up,
    }]
}
