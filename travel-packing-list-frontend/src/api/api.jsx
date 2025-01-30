import axios from "axios";

// Configurez le client Axios
const apiClient = axios.create({
    baseURL: "http://localhost:3000", // Remplacez par l'URL de votre API
    headers: {
        "Content-Type": "application/json",
    },
});

// Ajouter un intercepteur pour inclure le token JWT dans les requêtes
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken"); // Récupère le token depuis localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;

// Authentification
export const login = async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
};

export const register = async (email, password) => {
    const response = await apiClient.post("/auth/register", {
        email,
        password,
    });
    return response.data;
};

// Gestion des voyages
export const getTrips = async () => {
    const response = await apiClient.get("/trips");
    return response.data;
};

export const createTrip = async (tripData) => {
    const response = await apiClient.post("/trips", tripData);
    return response.data;
};

// Gestion des items
export const getItems = async (tripId) => {
    const response = await apiClient.get(`/items/${tripId}`);
    return response.data;
};

export const createItem = async (tripId, itemData) => {
    const response = await apiClient.post(`/items/${tripId}`, itemData);
    return response.data;
};
