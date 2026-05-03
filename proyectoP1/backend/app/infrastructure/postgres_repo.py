from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
from ..domain.interfaces import IQuickOrderRepository
from ..domain.entities import Mesa, MenuItem, Combo

class PostgresQuickOrderRepository(IQuickOrderRepository):
    def __init__(self, db_session: Session):
        self.db = db_session

    def get_mesas(self) -> List[Dict[str, Any]]:
        # Consultamos la vista para obtener: mesa (id), estado, cantidad_personas y carrito_activo
        query = text("SELECT * FROM vista_mesas ORDER BY mesa;")
        result = self.db.execute(query).mappings().all()
        
        # Devolvemos diccionarios directamente. 
        # Esto garantiza que 'carrito_activo' y 'estado' viajen al frontend.
        return [dict(row) for row in result]

    def get_state_mesa(self, id: int) -> bool:
        query = text("""SELECT esta_libre FROM mesa WHERE id = :id """)

        result = self.db.execute(query, {"id": id}).scalar()

        return result

    def get_last_pedido_by_mesa(self, id: int) -> int:
        query = text("""SELECT id FROM carrito WHERE id_mesa = :id ORDER BY id DESC LIMIT 1""")

        result = self.db.execute(query, {"id": id}).scalar()

        return result

    def get_menu(self) -> List[MenuItem]:
        query = text("SELECT * FROM menu;")
        result = self.db.execute(query).mappings().all()
        return [MenuItem(**row) for row in result]

    def get_combos(self) -> List[Combo]:
        query = text("SELECT * FROM combo;")
        result = self.db.execute(query).mappings().all()
        return [Combo(**row) for row in result]

    def abrir_carrito(self, id_mesa: int) -> int:
        query = text("CALL abrir_carrito(:mesa_id, NULL)")
        self.db.execute(query, {"mesa_id": int(id_mesa)})
        self.db.commit()
        
        fetch_query = text("SELECT id FROM carrito WHERE id_mesa = :mesa_id ORDER BY creado_en DESC LIMIT 1")
        carrito_id = self.db.execute(fetch_query, {"mesa_id": int(id_mesa)}).scalar()
        return carrito_id

    def agregar_menu(self, id_carrito: int, id_menu: int, cantidad: int, notas: str) -> None:
        query = text("""
            CALL agregar_menu(
                CAST(:carrito AS INTEGER), 
                CAST(:menu AS INTEGER), 
                CAST(:cant AS SMALLINT), 
                CAST(:nota AS VARCHAR)
            )
        """)
        self.db.execute(query, {
            "carrito": int(id_carrito), 
            "menu": int(id_menu), 
            "cant": int(cantidad), 
            "nota": str(notas) if notas else ""
        })
        self.db.commit()

    def agregar_combo(self, id_carrito: int, id_combo: int, cantidad: int, notas: str) -> None:
        query = text("""
            CALL agregar_combo(
                CAST(:carrito AS INTEGER), 
                CAST(:combo AS INTEGER), 
                CAST(:cant AS SMALLINT), 
                CAST(:nota AS VARCHAR)
            )
        """)
        self.db.execute(query, {
            "carrito": int(id_carrito), 
            "combo": int(id_combo), 
            "cant": int(cantidad), 
            "nota": str(notas) if notas else ""
        })
        self.db.commit()

    def get_carrito(self, id_carrito: int) -> List[Dict[str, Any]]:
        # JOIN vital para mostrar nombres en lugar de IDs
        query = text("""
            SELECT 
                COALESCE(m.nombre_platillo, c.nombre_combo) AS nombre,
                COALESCE(m.id, c.id) AS id,
                SUM(p.cantidad) AS cantidad_total,
                SUM(p.subtotal) AS subtotal_total
            FROM pedidos p
            LEFT JOIN menu m ON p.id_menu = m.id
            LEFT JOIN combo c ON p.id_combo = c.id
            WHERE p.id_carrito = CAST(:carrito AS INTEGER)
            GROUP BY 
                COALESCE(m.nombre_platillo, c.nombre_combo),
                COALESCE(m.id, c.id)
        """)
        result = self.db.execute(query, {"carrito": int(id_carrito)}).mappings().all()
        return [dict(row) for row in result]

    def cerrar_mesa(self, id_mesa: int) -> None:
        query = text("CALL cerrar_mesa(CAST(:mesa AS INTEGER))")
        self.db.execute(query, {"mesa": int(id_mesa)})
        self.db.commit()