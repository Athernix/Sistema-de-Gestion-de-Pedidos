// app.js
import { apiServices } from '../../Services/services.js';
import { stateManager } from '../../State/state.js';

let mesaId = null;

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    mesaId = urlParams.get('id') || 1;

    const mesaElement = document.getElementById("mesa-numero");
    if (mesaElement) mesaElement.textContent = mesaId;

    await inicializarEstadoMesa(mesaId);
    await cargarYRenderizarMenu();
    await cargarYRenderizarCombos();
});

// --- LÓGICA DE CARGA Y RENDERIZADO ---

async function inicializarEstadoMesa(mesaId) {
    try {
        const data = await apiServices.getEstadoMesa(mesaId);
        if (data && data.orden) {
            stateManager.inicializarCarritoOcupado(data);
        } else {
            stateManager.inicializarCarritoVacio(mesaId);
        }
    } catch (error) {
        console.error("Error verificando estado de mesa:", error);
    }
}

async function cargarYRenderizarMenu() {
    try {
        const menu = await apiServices.getMenu();
        stateManager.setMenu(menu); 
        
        const contenedor = document.getElementById("lista-menu");
        contenedor.innerHTML = menu.map(item => `
            <div class="card">
                <div>
                    <h3>${item.nombre_platillo}</h3>
                    <p>${item.descripcion_ingredientes}</p>
                    <div class="precio">$${item.precio.toLocaleString()}</div>
                </div>
                <button class="btn-add" onclick="window.procesarAgregadoCarrito('menu', ${item.id})">
                    Agregar +
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error cargando menú:", error);
    }
}

async function cargarYRenderizarCombos() {
    try {
        const combos = await apiServices.getCombos();
        stateManager.setCombos(combos); 

        const contenedor = document.getElementById("lista-combos");
        contenedor.innerHTML = combos.map(combo => `
            <div class="card">
                <div>
                    <h3>${combo.nombre_combo}</h3>
                    <p>${combo.descripcion}</p>
                    <div class="precio">$${combo.precio_combo.toLocaleString()}</div>
                </div>
                <button class="btn-add" onclick="window.procesarAgregadoCarrito('combo', ${combo.id})">
                    Agregar +
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error cargando combos:", error);
    }
}

function actualizarVistaCarrito() {
    const contenedor = document.getElementById("carrito-items");
    const carrito = stateManager.getCarrito();
    
    if (!carrito || !carrito.orden || carrito.orden.length === 0) {
        contenedor.innerHTML = "<p>Tu pedido está vacío.</p>";
        return;
    }

    let total = 0;

    contenedor.innerHTML = carrito.orden.map(item => {
        total += item.subtotal;
        return `
            <div class="carrito-item">
                <span>${item.cantidad}x ${item.nombre}</span> 
                <span>$${item.subtotal.toLocaleString()}</span>
            </div>
        `;
    }).join('');

    contenedor.innerHTML += `
        <div class="carrito-item total-row">
            <span>TOTAL:</span>
            <span>$${total.toLocaleString()}</span>
        </div>
    `;
}

// --- FUNCIONES EXPUESTAS AL DOM (HTML) ---
// Como estamos en un módulo, el HTML no "ve" estas funciones a menos que las colguemos de 'window'

window.procesarAgregadoCarrito = function(tipo, idElemento) {
    let nombre = "";
    let precio = 0;

    if (tipo === "menu") {
        const producto = stateManager.getMenu().find(x => x.id === idElemento);
        if (producto) { nombre = producto.nombre_platillo; precio = producto.precio; }
    } else if (tipo === "combo") {
        const combo = stateManager.getCombos().find(x => x.id === idElemento);
        if (combo) { nombre = combo.nombre_combo; precio = combo.precio_combo; }
    }

    stateManager.agregarItemAlCarrito(tipo, idElemento, nombre, precio);
    actualizarVistaCarrito();
};

window.toggleCarrito = function() {
    const modal = document.getElementById("carrito-modal");
    if (!modal) return;

    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        actualizarVistaCarrito();
        modal.style.display = "flex";
    }
};

window.showTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const targetTab = document.getElementById(tabName);
    if (targetTab) targetTab.classList.add('active');
    
    if (event) event.currentTarget.classList.add('active');
};

window.confirmarPedido = async function() {
    if (!confirm("¿Deseas enviar el pedido a cocina?")) return;

    const carrito = stateManager.getCarrito();

    if (!carrito || !carrito.orden.length) {
        alert("El carrito está vacío");
        return;
    }

    const menus = carrito.orden
        .filter(item => item.id_menu)
        .map(item => ({ id_menu: item.id_menu, cantidad: item.cantidad, notas: item.notas || "" }));

    const combos = carrito.orden
        .filter(item => item.id_combo)
        .map(item => ({ id_combo: item.id_combo, cantidad: item.cantidad, notas: item.notas || "" }));

    const payload = {
        id_carrito: carrito.id_carrito,
        id_mesa: carrito.id_mesa,
        menus,
        combos
    };

    try {
        const exito = await apiServices.enviarPedido(payload);
        if (exito) {
            // Limpiamos el carrito local
            stateManager.clearCarrito();
            
            // REDIRECCIÓN A LA VISTA DE ÉXITO
            // Ajusta la ruta si carrito.html está en otra carpeta
            window.location.href = "carrito.html"; 
        } else {
            alert("Error al enviar el pedido");
        }
    } catch (error) {
        console.error("Error al confirmar pedido:", error);
    }
};