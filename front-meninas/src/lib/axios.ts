import Axios from "axios";

export const ManageToken = {
  apiToken: "app_das_meninas_access",
  get: function () {
    return localStorage.getItem(this.apiToken) || "";
  },
  set: function (token: string) {
    localStorage.setItem(this.apiToken, token);
  },
  delete: function () {
    localStorage.clear();
  },
};

const api = Axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

api.interceptors.request.use((request) => {
  const token = ManageToken.get();
  request.headers.Authorization = `Bearer ${token}`;

  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error?.response || {};

    if (status === 401) {
      ManageToken.delete();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    console.log("Status", status);
    return Promise.reject(error);
  }
);

export { api };
