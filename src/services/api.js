import axios from "axios";

const API = axios.create({
  baseURL: "https://railway-monitoring-backend.onrender.com/api",
});

export default API;