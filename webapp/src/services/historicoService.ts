import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function buscarHistoricoTransacoes(page = 0, size = 20) {
  try {
    const token = localStorage.getItem("kh_token");

    const response = await axios.get(`${API_BASE_URL}/historico-transacoes`, {
      params: { page, size },
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    throw error;
  }
}
