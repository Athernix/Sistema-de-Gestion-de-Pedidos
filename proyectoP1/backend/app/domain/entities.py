from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class Mesa(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    cantidad_personas: int
    esta_libre: bool

class MenuItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    nombre_platillo: str
    precio: float # SQLAlchemy convertirá el DECIMAL de SQL a float aquí
    descripcion_ingredientes: str
    categoria: str
    disponible: bool

class Combo(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    nombre_combo: str
    id_platillo: int
    id_acompanamiento: int
    id_bebida: int
    precio_combo: float
    descripcion: Optional[str] = None # Agregado Optional por si el combo no tiene descripción
    disponible: bool

# DTOs para recibir datos (Request Models)
class AgregarMenuRequest(BaseModel):
    id_menu: int
    cantidad: int
    notas: Optional[str] = ""

class AgregarComboRequest(BaseModel):
    id_combo: int
    cantidad: int
    notas: Optional[str] = ""

class AgregarCarrito(BaseModel):
    id_carrito: int
    id_mesa: int
    menus: Optional[List[AgregarMenuRequest]]
    combos: Optional[List[AgregarComboRequest]]

class CerrarPedidoRequest(BaseModel):
    id_mesa: int

