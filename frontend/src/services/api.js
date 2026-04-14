import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-r4pj.onrender.com/api"
});

// 🔥 REQUEST INTERCEPTOR
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔥 RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default API;