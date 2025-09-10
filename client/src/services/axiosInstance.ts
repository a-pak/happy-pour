import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true, // This ensures cookies are sent with requests
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach(cb => cb());
  refreshSubscribers = [];
};

// Add a custom flag to prevent infinite loops
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      console.log('Refreshing token...');
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await axios.post(
            import.meta.env.VITE_BASE_API_URL + 'auth/refresh',
            {},
            { withCredentials: true }
          );
          isRefreshing = false;
          onRefreshed();
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(api(originalRequest)); // Retry original request
        });
      });
    }

    return Promise.reject(error);
  }
);


export default api;
