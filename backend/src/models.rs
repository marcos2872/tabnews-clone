use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

// USERS
#[derive(Debug, Serialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    #[serde(skip)]
    pub password_hash: String,
    pub tabcoins: i32,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUser {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub username: String,
}

// POSTS
#[derive(Debug, Serialize, FromRow)]
pub struct Post {
    pub id: Uuid,
    pub title: Option<String>,
    pub content: String,
    pub user_id: Uuid,
    pub parent_id: Option<Uuid>,
    pub tabcoins: i32,
    pub created_at: Option<DateTime<Utc>>,
    // We might want to join username, but let's keep it simple for MVP
}

#[derive(Debug, Serialize, FromRow)]
pub struct PostWithUser {
    pub id: Uuid,
    pub title: Option<String>,
    pub content: String,
    pub user_id: Uuid,
    pub username: String,
    pub parent_id: Option<Uuid>,
    pub tabcoins: i32,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreatePost {
    pub title: Option<String>,
    pub content: String,
    pub parent_id: Option<Uuid>,
}
