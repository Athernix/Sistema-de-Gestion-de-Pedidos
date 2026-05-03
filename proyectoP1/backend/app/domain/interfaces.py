from abc import ABC, abstractmethod
from typing import List, Dict, Any
from .entities import Mesa, MenuItem, Combo

class IQuickOrderRepository(ABC):
    """
    Contrato que cualquier repositorio de acceso a datos debe cumplir.
    Esto permite que la capa de aplicación no dependa de PostgreSQL directamente.
    """
    @abstractmethod
    def get_mesas(self) -> List[Mesa]: pass

    @abstractmethod
    def get_state_mesa(self, id: int) -> bool: pass

    @abstractmethod
    def get_last_pedido_by_mesa(self, id: int) -> int: pass

    @abstractmethod
    def get_menu(self) -> List[MenuItem]: pass

    @abstractmethod
    def get_combos(self) -> List[Combo]: pass

    @abstractmethod
    def abrir_carrito(self, id_mesa: int) -> int: pass

    @abstractmethod
    def agregar_menu(self, id_carrito: int, id_menu: int, cantidad: int, notas: str) -> None: pass

    @abstractmethod
    def agregar_combo(self, id_carrito: int, id_combo: int, cantidad: int, notas: str) -> None: pass

    @abstractmethod
    def get_carrito(self, id_carrito: int) -> Dict[str, Any]: pass

    @abstractmethod
    def cerrar_mesa(self, id_mesa: int) -> None: pass