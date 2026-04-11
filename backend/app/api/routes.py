from fastapi import APIRouter, Depends
from typing import List
from .dependencies import get_use_cases
from ..application.use_cases import QuickOrderUseCases
from ..domain.entities import Mesa, MenuItem, Combo, AgregarMenuRequest, AgregarComboRequest, CerrarPedidoRequest

router = APIRouter()

@router.get("/mesas", response_model=List[Mesa])
def get_mesas(uc: QuickOrderUseCases = Depends(get_use_cases)):
    return uc.obtener_catalogo_mesas()

@router.get("/menu", response_model=List[MenuItem])
def get_menu(uc: QuickOrderUseCases = Depends(get_use_cases)):
    return uc.obtener_catalogo_menu()

@router.get("/combos", response_model=List[Combo])
def get_combos(uc: QuickOrderUseCases = Depends(get_use_cases)):
    return uc.obtener_catalogo_combos()

@router.post("/carrito/{id_mesa}")
def abrir_carrito(id_mesa: int, uc: QuickOrderUseCases = Depends(get_use_cases)):
    return uc.iniciar_atencion_mesa(id_mesa)

@router.post("/pedido/menu")
def agregar_pedido_menu(request: AgregarMenuRequest, uc: QuickOrderUseCases = Depends(get_use_cases)):
    return uc.registrar_pedido_menu(request)

@router.post("/pedido/combo")
def agregar_pedido_combo(request: AgregarComboRequest, uc: QuickOrderUseCases = Depends(get_use_cases)):
    return uc.registrar_pedido_combo(request)

@router.get("/carrito/{id_carrito}")
def ver_carrito(id_carrito: int, uc: QuickOrderUseCases = Depends(get_use_cases)):
    return uc.revisar_carrito(id_carrito)

@router.post("/cerrar-pedido")
def cerrar_pedido(request: CerrarPedidoRequest, uc: QuickOrderUseCases = Depends(get_use_cases)):
    return uc.finalizar_pedido(request.id_mesa)