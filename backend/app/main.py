from fastapi import FastAPI
from .routes import router
from .database import engine, Base
from .config import settings
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)


app = FastAPI()

# Routes
app.include_router(router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Auth
# Middleware for authentication
# @app.middleware("http")
# async def authenticate_request(request: Request, call_next):
#     public_routes = ["/docs", "/openapi.json"]

#     if request.url.path not in public_routes:
#         # Extract the Authorization header
#         auth_header = request.headers.get("Authorization")

#         if not auth_header:
#             raise HTTPException(
#                 status_code=401, detail="Authorization header is missing"
#             )

#         # Validate the token (dummy validation for example)
#         token = auth_header.split(" ")[1] if " " in auth_header else None
#         if not token:
#             raise HTTPException(status_code=403, detail="Missing authentication token")

#         if not validate_token(token):
#             raise HTTPException(status_code=403, detail="Invalid authentication token")

#     # Proceed to the next request handler
#     response = await call_next(request)
#     return response
