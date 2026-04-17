# AI Image Generation Prompt Library

A full-stack library application for managing AI image generation prompts. This submission is aligned to the assignment requirements: prompt listing, prompt creation, single prompt detail retrieval, Redis-backed view counter, PostgreSQL persistence, polished frontend UI, and Docker Compose setup.

## Stack Used
- Frontend: React
- Backend: Node.js + Express
- Database: PostgreSQL
- Cache: Redis
- Containerization: Docker + Docker Compose

> Note: The assignment allows alternate frameworks when Angular/Django are not feasible, so this implementation uses React and Node.js while preserving the required product behavior.

## Features Covered
### Core Requirements
- List all prompts
- Create a new prompt
- Retrieve a single prompt
- Increment `view_count` in Redis on each `GET /prompts/:id`
- Return `view_count` in the prompt detail response
- Prompt list UI shows title and complexity
- Prompt detail UI shows content and live view count
- Add prompt form with validation:
  - Title minimum 3 characters
  - Content minimum 20 characters
  - Complexity must be 1 to 10
- Docker Compose setup for:
  - Frontend
  - Backend
  - PostgreSQL
  - Redis

### Extra Improvement
- Delete prompt functionality from list and detail pages
- Better error handling and responsive styling
- Health check endpoint: `GET /health`

## Project Structure
```text
library application/
├── backend/
│   ├── config/
│   ├── models/
│   │   └── prompt.js
│   ├── routes/
│   │   └── prompts.js
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddPromptForm.js
│   │   │   ├── PromptDetail.js
│   │   │   └── PromptList.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── init.sql
└── README.md
```

## API Endpoints
### `GET /prompts`
Returns all prompts.

### `POST /prompts`
Creates a prompt.

Example request body:
```json
{
  "title": "Cyberpunk City",
  "content": "A futuristic cyberpunk city at night with neon lights, holographic billboards, and rainy streets.",
  "complexity": 8
}
```

### `GET /prompts/:id`
Returns one prompt and increments its Redis-backed `view_count`.

### `DELETE /prompts/:id`
Deletes a prompt and clears its Redis view counter.

### `GET /health`
Simple backend health check.

## Validation Rules
The backend and frontend both validate:
- `title` must be at least 3 characters
- `content` must be at least 20 characters
- `complexity` must be an integer between 1 and 10

## How to Run
### Prerequisites
- Docker Desktop installed and running
- Use either of these commands depending on your Docker installation:

```bash
docker compose up --build
```

or:

```bash
docker-compose up --build
```

### Local URLs
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Health check: `http://localhost:3001/health`

## Architectural Notes
- PostgreSQL is the source of truth for prompt data.
- Redis is the source of truth for prompt view counts, as required.
- The backend increments the Redis counter on every prompt detail fetch.
- The frontend is a simple routed SPA with separate list, detail, and create views.
- Docker Compose starts all required services together for easy evaluation.

## Submission Notes
This project includes all required assignment features from the PDF, plus a small delete enhancement for better usability.
