const API_URL = 'https://dragonball-api.com/api';

export const api = {
  getPersonagens: async (limit = 30) => {
    const response = await fetch(`${API_URL}/characters?limit=${limit}`);
    const data = await response.json();
    return data.items || data;
  },
  
  getPersonagemPorId: async (id) => {
    const response = await fetch(`${API_URL}/characters/${id}`);
    return response.json();
  },
  
  buscarPersonagem: async (nome) => {
    const response = await fetch(`${API_URL}/characters?name=${nome}`);
    const data = await response.json();
    return data.items || data;
  }
};