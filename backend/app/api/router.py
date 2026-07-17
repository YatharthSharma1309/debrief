from fastapi import APIRouter

from app.api import auth, chat, documents, health, members, search, summary, workspaces

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(workspaces.router, tags=["workspaces"])
api_router.include_router(members.router, tags=["members"])
api_router.include_router(documents.router, tags=["documents"])
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(summary.router, tags=["summary"])
api_router.include_router(search.router, tags=["search"])
