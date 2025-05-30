import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Config axios instance
const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_DOMAIN_SERVER_API || 'https://smartome.dnmanh.io.vn/api',
    timeout: 20000, // Timeout after 20 seconds
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default axiosInstance;

// SecureStore utilities
const getToken = async (key: string) => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.log(`Error fetching token (${key}):`, error);
        return null;
    }
};

const getAccessToken = () => getToken(process.env.EXPO_PUBLIC_TOKEN_ACCESS_NAME || 'access_token');

const getRefreshToken = () => getToken(process.env.EXPO_PUBLIC_TOKEN_REFRESH_NAME || 'refresh_token');

// Fetch function for JSON data
export const axiosJSONData = async (
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data: Record<string, unknown> | null = null,
    tokenType: 'access' | 'refresh' | 'none' = 'access'
) => {
    try {
        const headers: Record<string, string> = {
            // 'Content-Type': method === 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (tokenType !== 'none') {
            const token = await (tokenType === 'access' ? getAccessToken() : getRefreshToken());
            if (token) headers.Authorization = `Bearer ${token}`;
        }

        const response = await axiosInstance({
            method,
            url: path,
            headers,
            data,
        });

        return response.data;
    } catch (error) {
        console.log(`Error in axiosJSONData (${path}):`, error);
        throw error;
    }
};

// Fetch function for FormData
export const axiosFormData = async (
    path: string,
    method: 'POST' | 'PUT' | 'DELETE' = 'POST',
    formData: FormData,
    tokenType: 'access' | 'refresh' | 'none' = 'access'
) => {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'multipart/form-data',
        };

        if (tokenType !== 'none') {
            const token = await (tokenType === 'access' ? getAccessToken() : getRefreshToken());
            if (token) headers.Authorization = `Bearer ${token}`;
        }

        const response = await axiosInstance({
            method,
            url: path,
            headers,
            data: formData,
        });

        return response.data;
    } catch (error) {
        console.log(`Error in axiosFormData (${path}):`, error);
        throw error;
    }
};
