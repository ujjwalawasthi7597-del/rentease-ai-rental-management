const API_BASE = '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers = {}, ...customConfig } = options;
  const token = localStorage.getItem('rentease_token');

  const reqHeaders: Record<string, string> = {
    ...((headers as Record<string, string>) || {}),
  };

  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  let body: any = undefined;
  if (data) {
    if (data instanceof FormData) {
      body = data;
      // Let browser set content-type with boundary for FormData
    } else {
      reqHeaders['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...customConfig,
    headers: reqHeaders,
    body,
  });

  const resData = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

  if (!response.ok) {
    const errorMsg = resData?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return resData;
}

export const api = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T = any>(endpoint: string, data?: any) => apiRequest<T>(endpoint, { method: 'POST', data }),
  put: <T = any>(endpoint: string, data?: any) => apiRequest<T>(endpoint, { method: 'PUT', data }),
  delete: <T = any>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
  upload: <T = any>(endpoint: string, formData: FormData) =>
    apiRequest<T>(endpoint, { method: 'POST', data: formData }),
};
