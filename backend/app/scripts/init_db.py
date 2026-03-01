from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.services.ingestion import ingest_sample_data


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    ingest_sample_data(db)
    db.close()
    print("Database initialized with sample data")
