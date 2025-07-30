import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL|| 'http://localhost:5000/api', // e.g. https://your-backend.onrender.com/api
});

export default API;
