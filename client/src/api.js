import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
});

let csrfToken = null;

// Retrieve CSRF token
async function getCsrfToken() {
  const response = await api.get('/csrf-token');
  csrfToken = response.data.csrfToken;
  return csrfToken;
}

// Automatically attach CSRF token to write requests
api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();

  const isWriteRequest = ['post', 'put', 'patch', 'delete'].includes(method);

  if (!isWriteRequest) {
    return config;
  }

  // Login and registration do not need CSRF protection
  if (
    config.url?.includes('/auth/login') ||
    config.url?.includes('/auth/register')
  ) {
    return config;
  }

  if (!csrfToken) {
    await getCsrfToken();
  }

  config.headers.set('x-csrf-token', csrfToken);

  return config;
});