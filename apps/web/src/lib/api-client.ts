import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

export const fetcher = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : null;
  const storeId = typeof window !== 'undefined' ? localStorage.getItem('sellzy_store_id') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (storeId) headers['x-store-id'] = storeId; // Inject store context for API

  const res = await fetch(`${getBaseUrl()}${url}`, { headers });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.error?.message || 'API request failed');
    (error as any).status = res.status;
    (error as any).info = errorData;
    throw error;
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
};

export function useApiQuery<T>(url: string | null, options?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, options);
}

const mutator = async (url: string, { arg }: { arg: { method?: string; body?: any } }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : null;
  const storeId = typeof window !== 'undefined' ? localStorage.getItem('sellzy_store_id') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (storeId) headers['x-store-id'] = storeId;

  const res = await fetch(`${getBaseUrl()}${url}`, {
    method: arg.method || 'POST',
    headers,
    body: arg.body ? JSON.stringify(arg.body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.error?.message || 'API request failed');
    (error as any).status = res.status;
    (error as any).info = errorData;
    throw error;
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
};

export function useApiMutation<T, S>(url: string, options?: SWRMutationConfiguration<T, Error, string, { method?: string; body?: S }>) {
  return useSWRMutation<T, Error, string, { method?: string; body?: S }>(url, mutator as any, options);
}
