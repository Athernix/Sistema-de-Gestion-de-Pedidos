from typing import List, Dict, Any
from ..domain.interfaces import IQuickOrderRepository
from ..domain.entities import Mesa, MenuItem, Combo, AgregarMenuRequest, AgregarComboRequest

class QuickOrderUseCases:
    def __init__(self, repository: IQuickOrderRepository):
        self.repo = repository

    def obtener_catalogo_mesas(self) -> List[Mesa]:
        return self.repo.get_mesas()

    def obtener_catalogo_menu(self) -> List[MenuItem]:
        return self.repo.get_menu()

    def obtener_catalogo_combos(self) -> List[Combo]:
        return self.repo.get_combos()

    def iniciar_atencion_mesa(self, id_mesa: int) -> Dict[str, Any]:
        carrito_id = self.repo.abrir_carrito(id_mesa)
        return {"mensaje": "Carrito abierto exitosamente", "id_carrito": carrito_id, "id_mesa": id_mesa}

    def registrar_pedido_menu(self, request: AgregarMenuRequest) -> Dict[str, str]:
        self.repo.agregar_menu(request.id_carrito, request.id_menu, request.cantidad, request.notas)
        return {"mensaje": "Platillo agregado al carrito"}

    def registrar_pedido_combo(self, request: AgregarComboRequest) -> Dict[str, str]:
        self.repo.agregar_combo(request.id_carrito, request.id_combo, request.cantidad, request.notas)
        return {"mensaje": "Combo agregado al carrito"}
    
    def revisar_carrito(self, id_carrito: int) -> List[Dict[str, Any]]:
        return self.repo.get_carrito(id_carrito)

    def finalizar_pedido(self, id_mesa: int) -> Dict[str, str]:
        self.repo.cerrar_mesa(id_mesa)
        return {"mensaje": "Mesa cerrada y pedido enviado a preparación"}