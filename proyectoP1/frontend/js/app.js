const API_BASE = "http://localhost:8000/api/v1";
let mesaId = null;
let carritoId = null;

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", async() => {
    const urlParams = new URLSearchParams(window.location.search);
    mesaId = urlParams.get('id') || 1; // Obtiene el ID de la URL o usa 1 por defecto

    const mesaElement = document.getElementById("mesa-numero");
    if (mesaElement) mesaElement.textContent = mesaId;

    // 1. Verificar si la mesa ya tiene un pedido activo (Estado de mesa)
    await verificarEstadoMesa();

    // 2. Cargar los productos
    await cargarMenu();
    await cargarCombos();
});

// --- LÓGICA DE ESTADO Y CARRITO ---

async function verificarEstadoMesa() {
    try {
        const res = await fetch(`${API_BASE}/mesas`);
        const mesas = await res.json();

        // Buscamos nuestra mesa en la lista que devuelve el backend
        const miMesa = mesas.find(m => m.mesa == mesaId || m.id == mesaId);

        // Si la mesa está ocupada, recuperamos el carrito existente
        if (miMesa && (miMesa.estado === "Ocupada" || !miMesa.esta_libre)) {
            carritoId = miMesa.carrito_activo;
            console.log("Mesa ocupada. Recuperando carrito ID:", carritoId);
            actualizarContadorCarrito(carritoId);
        } else {
            console.log("Mesa libre. Abriendo carrito nuevo...");
            await abrirCarrito();
        }
    } catch (error) {
        console.error("Error verificando estado de mesa:", error);
    }
}

async function abrirCarrito() {
    try {
        const res = await fetch(`${API_BASE}/carrito/${mesaId}`, { method: 'POST' });
        const data = await res.json();

        // Guardamos el ID del carrito (manejando si viene como objeto o número)
        carritoId = data.id_carrito || data;
        console.log("Carrito activo:", carritoId);

        actualizarContadorCarrito(carritoId);
    } catch (error) {
        console.error("Error al abrir carrito:", error);
    }
}

// --- CARGA DE PRODUCTOS ---

async function cargarMenu() {
    try {
        const res = await fetch(`${API_BASE}/menu`);
        const menu = await res.json();
        const contenedor = document.getElementById("lista-menu");

        contenedor.innerHTML = menu.map(item => `
            <div class="card">
                <div>
                    <h3>${item.nombre_platillo}</h3>
                    <p>${item.descripcion_ingredientes}</p>
                    <div class="precio">$${item.precio.toLocaleString()}</div>
                </div>
                <button class="btn-add" onclick="agregarAlCarrito('menu', ${item.id})">Agregar +</button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error cargando menú:", error);
    }
}

async function cargarCombos() {
    try {
        const res = await fetch(`${API_BASE}/combos`);
        const combos = await res.json();
        const contenedor = document.getElementById("lista-combos");

        contenedor.innerHTML = combos.map(combo => `
            <div class="card">
                <div>
                    <h3>${combo.nombre_combo}</h3>
                    <p>${combo.descripcion}</p>
                    <div class="precio">$${combo.precio_combo.toLocaleString()}</div>
                </div>
                <button class="btn-add" onclick="agregarAlCarrito('combo', ${combo.id})">Agregar +</button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error cargando combos:", error);
    }
}

// --- GESTIÓN DE PEDIDOS ---

async function agregarAlCarrito(tipo, idElemento) {
    if (!carritoId) {
        alert("Iniciando carrito... intenta de nuevo en un segundo.");
        await abrirCarrito();
        return;
    }

    const endpoint = tipo === 'menu' ? '/pedido/menu' : '/pedido/combo';
    const payload = {
        id_carrito: parseInt(carritoId),
        cantidad: 1,
        notas: ""
    };

    if (tipo === 'menu') payload.id_menu = parseInt(idElemento);
    if (tipo === 'combo') payload.id_combo = parseInt(idElemento);

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("¡Agregado con éxito!");
            // Actualizamos el número del botón verde inmediatamente
            actualizarContadorCarrito(carritoId);
        } else {
            alert("No se pudo agregar el producto.");
        }
    } catch (error) {
        console.error("Error en la petición:", error);
    }
}

async function actualizarVistaCarrito() {
    if (!carritoId) return;

    try {
        const res = await fetch(`${API_BASE}/carrito/${carritoId}`);
        const pedidos = await res.json();
        const contenedor = document.getElementById("carrito-items");

        if (!pedidos || pedidos.length === 0) {
            contenedor.innerHTML = "<p>Tu comanda está vacía.</p>";
            return;
        }

        let total = 0;
        contenedor.innerHTML = pedidos.map(p => {
            total += parseFloat(p.subtotal);
            // Usamos p.nombre que viene gracias al JOIN en el backend
            return `
                <div class="carrito-item">
                    <span>${p.cantidad}x ${p.nombre}</span> 
                    <span>$${parseFloat(p.subtotal).toLocaleString()}</span>
                </div>
            `;
        }).join('');

        contenedor.innerHTML += `
            <div class="carrito-item total-row">
                <span>TOTAL:</span>
                <span>$${total.toLocaleString()}</span>
            </div>
        `;
    } catch (error) {
        console.error("Error al obtener detalle del carrito:", error);
    }
}

function actualizarContadorCarrito(id) {
    if (!id) return;
    fetch(`${API_BASE}/carrito/${id}`)
        .then(res => res.json())
        .then(data => {
            const boton = document.querySelector('.btn-carrito');
            if (boton) {
                const total = data.reduce((sum, item) => sum + item.cantidad, 0);
                boton.innerHTML = `🛒 Ver Pedido (${total})`;
            }
        })
        .catch(err => console.error("Error actualizando contador:", err));
}

// --- UI Y NAVEGACIÓN ---

function toggleCarrito() {
    const modal = document.getElementById("carrito-modal");
    if (!modal) return;

    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        actualizarVistaCarrito();
        modal.style.display = "flex";
    }
}

async function confirmarPedido() {
    if (!confirm("¿Deseas enviar el pedido a cocina?")) return;
    try {
        const res = await fetch(`${API_BASE}/cerrar-pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_mesa: parseInt(mesaId) })
        });

        if (res.ok) {
            alert("¡Pedido enviado a cocina! La mesa se ha liberado.");
            window.location.reload();
        }
    } catch (error) {
        console.error("Error al confirmar pedido:", error);
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const targetTab = document.getElementById(tabName);
    if (targetTab) targetTab.classList.add('active');
    if (event) event.currentTarget.classList.add('active');
}