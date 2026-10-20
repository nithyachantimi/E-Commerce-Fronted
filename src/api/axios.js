import axios from 'axios';

// Base API URL pointing to the Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let csrfInitialization;
apiClient.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  const safeMethod = ['get', 'head', 'options'].includes(method);
  if (safeMethod || config.skipCsrfInitialization) return config;

  const cookieExists = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('XSRF-TOKEN='));
  if (!cookieExists) {
    csrfInitialization ??= apiClient.get('/csrf', { skipCsrfInitialization: true })
      .finally(() => { csrfInitialization = undefined; });
    await csrfInitialization;
  }
  return config;
});

export default apiClient;
