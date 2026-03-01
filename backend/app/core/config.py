from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Vegetation Vision API"
    env: str = "dev"
    database_url: str = "sqlite:///./vegetation.db"
    cors_origins: str = "http://localhost:3000"
    risk_weights_file: str = "app/data/risk_weights.yaml"
    enable_upload_endpoint: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
