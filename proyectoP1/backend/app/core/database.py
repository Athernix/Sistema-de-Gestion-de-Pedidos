from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# En producción, esto vendría de variables de entorno (.env)
DATABASE_URL = "postgresql://postgres:2005@localhost:5432/restaurante_comida_rapida"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Generador para la inyección de dependencias de la sesión de BD."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()