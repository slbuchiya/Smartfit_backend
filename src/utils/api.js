import axios from "axios";

// Environment variable માંથી URL લો અથવા Localhost વાપરો
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: જ્યારે પણ API કોલ થાય, ત્યારે Token સાથે મોકલવો
api.interceptors.request.use((config) => {
    // જો યુઝર લોગિન હોય તો લોકલ સ્ટોરેજમાંથી ટોકન લો (જો આપણે સેવ કર્યું હોય તો)
    // નોંધ: આપણે હજુ લોકલ સ્ટોરેજમાં ટોકન સેવ નથી કરતા, પણ ભવિષ્ય માટે આ સારું છે.
    const user = JSON.parse(localStorage.getItem("smartstore_user"));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// આ લાઈન ખૂબ મહત્વની છે - આના વગર પેલી એરર આવે છે
export default api;