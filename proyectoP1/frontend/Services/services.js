// services.js
const API_BASE = "http://localhost:8000/api/v1";

export const apiServices = {
    async getEstadoMesa(mesaId) {
        const res = await fetch(`${API_BASE}/estado_mesa/${mesaId}`);
        return await res.json();
    },

    async getMenu() {
        const res = await fetch(`${API_BASE}/menu`);
        return await res.json();
    },

    async getCombos() {
        const res = await fetch(`${API_BASE}/combos`);
        return await res.json();
    },

    async enviarPedido(payload) {
        const res = await fetch(`${API_BASE}/load_carrito`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        return res.ok;
    }
};