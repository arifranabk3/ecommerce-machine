/**
 * API Client / Service Layer
 * Connects to the existing Node.js/Express backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const apiClient = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error('API Request Failed');
    return res.json();
  }
};
