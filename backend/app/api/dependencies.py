from fastapi import Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..infrastructure.postgres_repo import PostgresQuickOrderRepository
from ..application.use_cases import QuickOrderUseCases

# Configuración de Inyección de Dependencias
def get_repository(db: Session = Depends(get_db)) -> PostgresQuickOrderRepository:
    return PostgresQuickOrderRepository(db)

def get_use_cases(repo: PostgresQuickOrderRepository = Depends(get_repository)) -> QuickOrderUseCases:
    return QuickOrderUseCases(repo)