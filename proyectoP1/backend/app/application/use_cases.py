from typing import List, Dict, Any, Optional
from ..domain.interfaces import IQuickOrderRepository
from ..domain.entities import Mesa, MenuItem, Combo, AgregarMenuRequest, AgregarComboRequest

class QuickOrderUseCases:
    def __init__(self, repository: IQuickOrderRepository):
        self.repo = repository

    def obtener_catalogo_mesas(self) -> List[Mesa]:
        return self.repo.get_mesas()

    def get_state_mesa(self, id_mesa: int) -> Optional[Dict[str, Any]]:
        libre: bool = self.repo.get_state_mesa(id_mesa)

        if libre:
            return None

        id_carrito = self.repo.get_last_pedido_by_mesa(id_mesa)
        if not id_carrito:
            return None

        items = self.repo.get_carrito(id_carrito)
        if not items:
            return {
                "id_carrito": id_carrito,
                "orden": None
            }

        return {
            "id_carrito": id_carrito,
            "orden": items
        }

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

    def cargar_carrito( self, id_carrito: int, id_mesa, menus: list[AgregarMenuRequest], combos: list[AgregarComboRequest] ) -> dict:
        errores = []

        if (id_carrito == 0):
            id_carrito = self.repo.abrir_carrito(id_mesa)

        # Procesar menús
        for menu in menus:
            try:
                self.repo.agregar_menu(
                    id_carrito,
                    menu.id_menu,
                    menu.cantidad,
                    menu.notas
                )
            except Exception:
                errores.append(f"Hubo un error en el platillo: {menu.id_menu}")

        # Procesar combos
        for combo in combos:
            try:
                self.repo.agregar_combo(
                    id_carrito,
                    combo.id_combo,
                    combo.cantidad,
                    combo.notas
                )
            except Exception:
                errores.append(f"Hubo un error en el combo: {combo.id_combo}")

        if errores:
            return {
                "status": "error",
                "detalle": errores
            }

        self.repo.cerrar_mesa(id_mesa)

        return {
            "status": "ok",
            "mensaje": "Carrito cargado correctamente"
    }

    def finalizar_pedido(self, id_mesa: int) -> Dict[str, str]:
        self.repo.cerrar_mesa(id_mesa)
        return {"mensaje": "Mesa cerrada y pedido enviado a preparación"}