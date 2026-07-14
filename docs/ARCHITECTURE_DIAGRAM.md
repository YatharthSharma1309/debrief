# Architecture Diagram

## System overview

```mermaid
flowchart TB
    User([User])

    subgraph Frontend["React Frontend (Vercel)"]
        UI[Pages & Components]
        TQ[TanStack Query]
        ZS[Zustand Auth/Theme]
    end

    subgraph API["FastAPI Backend (Railway/Render)"]
        Auth[Authentication<br/>JWT]
        WS[Workspaces]
        DOC[Documents<br/>Upload & Parse]
        SUM[AI Summary]
        CHAT[Chat<br/>SSE Streaming]
        RAG[RAG Pipeline]
        EMB[Embeddings]
    end

    subgraph Data["Data Layer"]
        PG[(PostgreSQL + pgvector)]
        FILES[File Storage]
    end

    OAI[OpenAI API<br/>Embeddings + Chat]

    User --> UI
    UI --> TQ
    TQ -->|REST + SSE| Auth
    TQ --> WS
    TQ --> DOC
    TQ --> SUM
    TQ --> CHAT

    Auth --> PG
    WS --> PG
    DOC --> FILES
    DOC --> EMB
    EMB --> OAI
    EMB --> PG
    SUM --> RAG
    CHAT --> RAG
    RAG --> PG
    RAG --> OAI
    CHAT --> PG
```

## Document ingestion flow

```mermaid
sequenceDiagram
    participant U as User
    participant API as FastAPI
    participant S as Storage
    participant O as OpenAI
    participant DB as PostgreSQL

    U->>API: Upload PDF/DOCX/TXT
    API->>S: Save file
    API->>DB: Document (pending)
    API-->>U: 201 Created

    Note over API: Background task
    API->>API: Parse & chunk text
    API->>O: Embed chunks
    O-->>API: Vectors
    API->>DB: Chunks + embeddings
    API->>DB: Status = ready
```

## Chat / RAG flow

```mermaid
sequenceDiagram
    participant U as User
    participant API as FastAPI
    participant DB as pgvector
    participant O as OpenAI

    U->>API: Send message (SSE)
    API->>DB: Save user message
    API->>O: Embed query
    API->>DB: Similarity search (top-k)
    DB-->>API: Relevant chunks
    API->>O: Stream chat completion
    O-->>API: Tokens
    API-->>U: SSE token events
    API-->>U: SSE citations
    API->>DB: Save assistant message
    API-->>U: SSE done
```

## API modules

```text
/api
├── /auth          Register, login, me
├── /workspaces    CRUD
├── /workspaces/{id}/documents   Upload, list, delete
├── /workspaces/{id}/summary     AI workspace overview
├── /workspaces/{id}/suggested-questions
└── /workspaces/{id}/chat/sessions   Streaming RAG chat
```
