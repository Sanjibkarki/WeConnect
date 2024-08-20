import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userloaded, autherror } from '../reducers/auth'; 

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const dispatch = useDispatch();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) {
          dispatch(autherror());
          return Promise.reject(error);
        }

        const config = {
          headers: { 'Content-Type': 'application/json' },
        };
        const body = JSON.stringify({ refresh });
        const res = await axios.post('/token/refresh', body, config);
        localStorage.removeItem('access')
        localStorage.setItem('access', res.data.access);

        originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        dispatch(autherror());
        return Promise.reject(refreshError);
      }
    }

    dispatch(autherror());
    return Promise.reject(error);
  }
);

export default axiosInstance;
