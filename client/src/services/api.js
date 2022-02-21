import axios from "axios";
// import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8000/",
  // for dev : http://localhost:8080/api/
  // for production_test : https://animazonetest.herokuapp.com/api/
  // headers: {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT",
  // },
});

// api.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("x-access-token");
//     if (token) {
//       config.headers["x-access-token"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (res) => {
//     return res;
//   },
//   async (err) => {
//     const originalConfig = err.config;
//     if (originalConfig.url !== "/login" && err.response) {
//       if (err.response.status === 401 && !originalConfig._retry) {
//         originalConfig._retry = true;
//         try {
//           await api
//             .post("/token/refresh", {
//               token: Cookies.get("x-refresh-token"),
//             })
//             .then((response) => {
//               const { accessToken, refreshToken } = response.data;
//               Cookies.set("x-access-token", accessToken);
//               Cookies.set("x-refresh-token", refreshToken);
//             });
//           return api(originalConfig);
//         } catch (_error) {
//           return Promise.reject(_error);
//         }
//       }
//     }
//     return Promise.reject(err);
//   }
// );

export default api;
