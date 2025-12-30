use crate::auth::{create_jwt, hash_password, verify_password, AuthUser};
use crate::db::DbPool;
use crate::models::{AuthResponse, CreatePost, CreateUser, LoginUser, Post, PostWithUser, User};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;

// AUTH HANDLERS
pub async fn register(
    State(pool): State<DbPool>,
    Json(payload): Json<CreateUser>,
) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    let hashed_password = hash_password(&payload.password);
    let user_id = Uuid::new_v4();

    let user = sqlx::query_as::<_, User>(
        "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *"
    )
    .bind(user_id)
    .bind(&payload.username)
    .bind(&payload.email)
    .bind(hashed_password)
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let token = create_jwt(user.id).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(AuthResponse {
        token,
        username: user.username,
    }))
}

pub async fn login(
    State(pool): State<DbPool>,
    Json(payload): Json<LoginUser>,
) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::UNAUTHORIZED, "Invalid credentials".to_string()))?;

    if !verify_password(&payload.password, &user.password_hash) {
        return Err((StatusCode::UNAUTHORIZED, "Invalid credentials".to_string()));
    }

    let token = create_jwt(user.id).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(AuthResponse {
        token,
        username: user.username,
    }))
}

// POST HANDLERS
pub async fn create_post(
    State(pool): State<DbPool>,
    AuthUser { user_id }: AuthUser,
    Json(payload): Json<CreatePost>,
) -> Result<Json<Post>, (StatusCode, String)> {
    let post_id = Uuid::new_v4();

    let post = sqlx::query_as::<_, Post>(
        "INSERT INTO posts (id, title, content, user_id, parent_id) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    )
    .bind(post_id)
    .bind(payload.title)
    .bind(payload.content)
    .bind(user_id)
    .bind(payload.parent_id)
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(post))
}

pub async fn list_posts(
    State(pool): State<DbPool>,
) -> Result<Json<Vec<PostWithUser>>, (StatusCode, String)> {
    // Only fetch root posts (no parent_id) for the main feed
    let posts = sqlx::query_as::<_, PostWithUser>(
        r#"
        SELECT p.id, p.title, p.content, p.user_id, u.username, p.parent_id, p.tabcoins, p.created_at
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.parent_id IS NULL
        ORDER BY p.created_at DESC
        LIMIT 50
        "#
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(posts))
}

pub async fn get_post(
    State(pool): State<DbPool>,
    Path(post_id): Path<Uuid>,
) -> Result<Json<PostWithUser>, (StatusCode, String)> {
    let post = sqlx::query_as::<_, PostWithUser>(
        r#"
        SELECT p.id, p.title, p.content, p.user_id, u.username, p.parent_id, p.tabcoins, p.created_at
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = $1
        "#
    )
    .bind(post_id)
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .ok_or((StatusCode::NOT_FOUND, "Post not found".to_string()))?;

    Ok(Json(post))
}

// Simple vote implementation: +1 TabCoin
pub async fn vote_post(
    State(pool): State<DbPool>,
    _auth: AuthUser, // Require auth, but we don't track who voted to prevent abuse in this MVP
    Path(post_id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
    // Increment tabcoins
    let _ = sqlx::query("UPDATE posts SET tabcoins = tabcoins + 1 WHERE id = $1")
        .bind(post_id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        
    // Optionally give coins to the author too
    // ...

    Ok(StatusCode::OK)
}
