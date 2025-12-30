# TabNews Clone MVP

Este é um projeto MVP (Minimum Viable Product) de um clone do **TabNews**, uma plataforma de conteúdo para programadores.

O objetivo é fornecer funcionalidades básicas de uma rede social de conteúdo, incluindo cadastro de usuários, criação de posts com suporte a Markdown, e um sistema de "TabCoins".

## Tecnologias Utilizadas

### Backend
- **Linguagem:** Rust
- **Framework:** Axum
- **Banco de Dados:** PostgreSQL (com SQLx)
- **Autenticação:** JWT & Argon2
- **Hot Reload:** cargo-watch

### Frontend
- **Framework:** Angular 17+
- **Estilização:** Tailwind CSS (com Dark Mode)
- **Markdown:** marked
- **State:** Angular Signals

## Funcionalidades
- Cadastro e Login de usuários.
- Listagem, Criação, Edição e Remoção de publicações.
- Suporte a **Markdown** com preview em tempo real.
- **Dark Mode** completo.
- Sistema de votação (TabCoins).

## Como Rodar

Este repositório é dividido em duas partes principais:

1.  **Backend:** API REST desenvolvida em Rust.
2.  **Frontend:** Aplicação SPA desenvolvida em Angular.

Consulte os arquivos `README.md` dentro de cada pasta (`backend/` e `frontend/`) para instruções detalhadas de configuração e execução.
