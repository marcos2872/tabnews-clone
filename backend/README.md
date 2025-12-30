# TabNews Clone - Backend

API desenvolvida em Rust utilizando o framework Axum e banco de dados PostgreSQL.

## Pré-requisitos

- **Rust** (Cargo) instalado.
- **PostgreSQL** rodando localmente.
- (Opcional) `sqlx-cli` para gerenciamento manual de migrações (`cargo install sqlx-cli`).
- (Opcional) `cargo-watch` para hot reload (`cargo install cargo-watch`).

## Configuração

1.  Crie o banco de dados:
    ```bash
    createdb tabnews_clone
    ```

    *Nota: A URL de conexão padrão configurada no `.env` é `postgres://postgres:password@localhost:5432/tabnews_clone`. Ajuste o arquivo `.env` se suas credenciais forem diferentes.*

2.  As migrações serão rodadas automaticamente ao iniciar a aplicação. Se preferir rodar manualmente:
    ```bash
    sqlx migrate run
    ```

## Como Rodar

### Modo Desenvolvimento (Hot Reload)
Se você instalou o `cargo-watch`:
```bash
cargo watch -x run
```
O servidor irá reiniciar automaticamente ao salvar arquivos.

### Modo Padrão
```bash
cargo run
```

O servidor estará rodando em `http://127.0.0.1:3000`.
