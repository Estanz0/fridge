from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./local.db"
    CORS_ALLOW_ORIGINS: list[str] = ["*"]

    APPWRITE_ENDPOINT: str = "https://cloud.appwrite.io/v1"
    APPWRITE_PROJECT_ID: str = ""
    APPWRITE_API_KEY: str = ""
    APPWRITE_VERIFICATION_URL: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
