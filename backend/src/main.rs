use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use dotenvy::dotenv;
use std::env;

mod auth;
mod db;
mod handlers;
mod models;

#[tokio::main]
async fn main() {
    dotenv().ok(); // Load .env
    
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/tabnews".to_string());
    
    let pool = db::init_db(&database_url).await.expect("Failed to connect to database");
    
    // Run Migrations
    println!("Running migrations...");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");
    println!("Migrations executed successfully.");

    let app = Router::new()
        .route("/api/auth/register", post(handlers::register))
        .route("/api/auth/login", post(handlers::login))
        .route("/api/posts", post(handlers::create_post).get(handlers::list_posts))
        .route("/api/posts/:id", get(handlers::get_post).put(handlers::update_post).delete(handlers::delete_post))
        .route("/api/posts/:id/vote", post(handlers::vote_post))
        .layer(CorsLayer::permissive()) // Allow all CORS for MVP
        .with_state(pool);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Backend listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
