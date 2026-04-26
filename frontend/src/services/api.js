import axios from "axios";

const API = axios.create({ baseURL: "/api" });

export const fetchMatches = () => API.get("/matches").then((r) => r.data);
export const fetchPlayers = (id) =>
  API.get(`/matches/${id}/players`).then((r) => r.data);
export const predictBestXI = (id) =>
  API.post("/predict", { match_id: id }).then((r) => r.data);
