mod db;
mod error;
mod gpx_parser;
mod models;

use error::AppError;
use models::ParsedRoute;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn parse_gpx(file_path: String) -> Result<ParsedRoute, AppError> {
    let content = tokio::fs::read_to_string(&file_path).await?;
    gpx_parser::parse_gpx_content(&content)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_url = "sqlite:road-radar.db";

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations(db_url, db::migrations())
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![greet, parse_gpx])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
