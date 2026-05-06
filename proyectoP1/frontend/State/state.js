// state.js
export const stateManager = {
    getCarrito: () => JSON.parse(localStorage.getItem("carrito")),
    setCarrito: (carrito) => localStorage.setItem("carrito", JSON.stringify(carrito)),
    clearCarrito: () => localStorage.removeItem("carrito"),
    
    getMenu: () => JSON.parse(localStorage.getItem("menu")) || [],
    setMenu: (menu) => localStorage.setItem("menu", JSON.stringify(menu)),
    
    getCombos: () => JSON.parse(localStorage.getItem("combos")) || [],
    setCombos: (combos) => localStorage.setItem("combos", JSON.stringify(combos)),

    inicializarCarritoOcupado(data) {
        const carritoPlano = {
            id_carrito: data.id_carrito,
            id_mesa: data.id_mesa,
            orden: data.orden.map(item => {
                const esCombo = item.nombre?.toLowerCase().includes("combo");
                return {
                    nombre: item.nombre,
                    cantidad: item.cantidad_total,
                    subtotal: item.subtotal_total,
                    ...(esCombo ? { id_combo: item.id } : { id_menu: item.id })
                };
            })
        };
        this.setCarrito(carritoPlano);
    },

    inicializarCarritoVacio(mesaId) {
        const carritoVacio = {
            id_carrito: 0,
            id_mesa: mesaId,
            orden: []
        };
        this.setCarrito(carritoVacio);
    },

    agregarItemAlCarrito(tipo, idElemento, nombre, precio) {
        let carrito = this.getCarrito();

        const itemExistente = carrito.orden.find(item => {
            if (tipo === "menu") return item.id_menu === idElemento;
            if (tipo === "combo") return item.id_combo === idElemento;
        });

        if (itemExistente) {
            itemExistente.cantidad += 1;
            itemExistente.subtotal += precio;
        } else {
            const nuevoItem = {
                nombre: nombre,
                cantidad: 1,
                subtotal: precio,
                ...(tipo === "menu" ? { id_menu: idElemento } : { id_combo: idElemento })
            };
            carrito.orden.push(nuevoItem);
        }

        this.setCarrito(carrito);
    }
};