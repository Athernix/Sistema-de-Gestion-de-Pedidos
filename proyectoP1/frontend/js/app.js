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
    await verificarEstado(mesaId);

    // 2. Cargar los productos
    await cargarMenu();
    await cargarCombos();
});

// --- LÓGICA DE ESTADO Y CARRITO ---

async function verificarEstado(mesaId) {
    try {
        const res = await fetch(`${API_BASE}/estado_mesa/${mesaId}`);
        const data = await res.json();

        console.log("Respuesta backend:", data);

        if (data && data.orden) {
            console.log("Mesa ocupada. Recuperando carrito");

            const carritoPlano = {
                id_carrito: data.id_carrito,
                id_mesa: data.id_mesa,
                orden: data.orden.map(item => {
                    const esCombo = item.nombre?.toLowerCase().includes("combo");

                    return {
                        nombre: item.nombre,
                        cantidad: item.cantidad_total,
                        subtotal: item.subtotal_total,
                        ...(esCombo
                            ? { id_combo: item.id }
                            : { id_menu: item.id }
                        )
                    };
                })
            };

            localStorage.setItem("carrito", JSON.stringify(carritoPlano));

        } else {
            console.log("Mesa libre");

            const carritoVacio = {
                id_carrito: 0,
                id_mesa: mesaId,
                orden: []
            };

            localStorage.setItem("carrito", JSON.stringify(carritoVacio));
        }

        // 🔹 DEBUG obligatorio
        console.log("LocalStorage ahora:", localStorage.getItem("carrito"));

    } catch (error) {
        console.error("Error verificando estado de mesa:", error);
    }
}

// --- CARGA DE PRODUCTOS ---

async function cargarMenu() {
    try {
        const res = await fetch(`${API_BASE}/menu`);
        const menu = await res.json();
        const contenedor = document.getElementById("lista-menu");

        // 🔹 guardar en localStorage
        localStorage.setItem("menu", JSON.stringify(menu));

        contenedor.innerHTML = menu.map(item => `
            <div class="card">
                <div>
                    <h3>${item.nombre_platillo}</h3>
                    <p>${item.descripcion_ingredientes}</p>
                    <div class="precio">$${item.precio.toLocaleString()}</div>
                </div>
                <button class="btn-add" onclick="agregarAlCarrito('menu', ${item.id})">
                    Agregar +
                </button>
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

        // 🔹 guardar en localStorage
        localStorage.setItem("combos", JSON.stringify(combos));

        contenedor.innerHTML = combos.map(combo => `
            <div class="card">
                <div>
                    <h3>${combo.nombre_combo}</h3>
                    <p>${combo.descripcion}</p>
                    <div class="precio">$${combo.precio_combo.toLocaleString()}</div>
                </div>
                <button class="btn-add" onclick="agregarAlCarrito('combo', ${combo.id})">
                    Agregar +
                </button>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error cargando combos:", error);
    }
}

// --- GESTIÓN DE PEDIDOS ---

function agregarAlCarrito(tipo, idElemento, nombre, precio) {
    // Obtener carrito actual
    let carrito = JSON.parse(localStorage.getItem("carrito"));

    //Buscar si el producto ya existe
    const itemExistente = carrito.orden.find(item => {
        if (tipo === "menu") return item.id_menu === idElemento;
        if (tipo === "combo") return item.id_combo === idElemento;
    });

    if (itemExistente) {
        // 🔹 Si ya existe, aumentamos cantidad
        itemExistente.cantidad += 1;
        itemExistente.subtotal += precio;
    } else {
        // 🔹 Si no existe, lo agregamos
        const nuevoItem = {
            nombre: nombre,
            cantidad: 1,
            subtotal: precio,
            ...(tipo === "menu"
                ? { id_menu: idElemento }
                : { id_combo: idElemento }
            )
        };

        carrito.orden.push(nuevoItem);
    }

    // 🔹 Guardar en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // 🔹 Actualizar vista
    actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
    const contenedor = document.getElementById("carrito-items");

    const carrito = JSON.parse(localStorage.getItem("carrito"));
    const menu = JSON.parse(localStorage.getItem("menu")) || [];
    const combos = JSON.parse(localStorage.getItem("combos")) || [];

    if (!carrito || !carrito.orden || carrito.orden.length === 0) {
        contenedor.innerHTML = "<p>Tu pedido está vacío.</p>";
        return;
    }

    let total = 0;

    contenedor.innerHTML = carrito.orden.map(item => {
        let nombre = "";
        let precioUnitario = 0;

        // 🔹 buscar en MENU
        if (item.id_menu) {
            const m = menu.find(x => x.id === item.id_menu);
            nombre = m?.nombre_platillo || "Producto";
            precioUnitario = m?.precio || 0;
        }

        // 🔹 buscar en COMBOS
        if (item.id_combo) {
            const c = combos.find(x => x.id === item.id_combo);
            nombre = c?.nombre_combo || "Combo";
            precioUnitario = c?.precio_combo || 0;
        }

        const subtotal = precioUnitario * item.cantidad;
        total += subtotal;

        return `
            <div class="carrito-item">
                <span>${item.cantidad}x ${nombre}</span> 
                <span>$${subtotal.toLocaleString()}</span>
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

    const carrito = JSON.parse(localStorage.getItem("carrito"));

    if (!carrito || !carrito.orden.length) {
        alert("El carrito está vacío");
        return;
    }

    // 🔹 separar menus
    const menus = carrito.orden
        .filter(item => item.id_menu)
        .map(item => ({
            id_menu: item.id_menu,
            cantidad: item.cantidad,
            notas: item.notas || ""
        }));

    // 🔹 separar combos
    const combos = carrito.orden
        .filter(item => item.id_combo)
        .map(item => ({
            id_combo: item.id_combo,
            cantidad: item.cantidad,
            notas: item.notas || ""
        }));

    const payload = {
        id_carrito: carrito.id_carrito,
        id_mesa: carrito.id_mesa,
        menus,
        combos
    };

    try {
        const res = await fetch(`${API_BASE}/load_carrito`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("¡Pedido enviado a cocina!");

            localStorage.removeItem("carrito");

            window.location.reload();
        } else {
            alert("Error al enviar el pedido");
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