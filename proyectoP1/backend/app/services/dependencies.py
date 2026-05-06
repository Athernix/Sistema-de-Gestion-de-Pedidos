from fastapi import Depends
from ..repositories.database import get_db
from ..repositories.postgres_repo import PostgresQuickOrderRepository
from .use_cases import QuickOrderUseCases

def get_use_case(db = Depends(get_db)):
    repo = PostgresQuickOrderRepository(db)
    return QuickOrderUseCases(repo)