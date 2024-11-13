
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Config axios
const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_DOMAIN_SERVER_API || 'https://smartome.dnmanh.io.vn/api',
    timeout: 10000,  // Timeout after 10s
});

// Add interceptor to request handle before sending
axiosInstance.interceptors.request.use(
    (config:any) => {
        return config;
    },
    (error:any) => {
        return Promise.reject(error);
    }
);

// Add interceptor to response handle
axiosInstance.interceptors.response.use(
    (response:any) => {
        return response;
    },
    (error:any) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

/// --------------------------------------------

const getAccessToken = async () => {
    try {
        return await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_TOKEN_ACCESS_NAME || 'access_token');
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}

const getRefreshToken = async () => {
    try {
        return await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_TOKEN_REFRESH_NAME || 'refresh_token');
    } catch (error) {
        console.error('Error fetching refresh token:', error);
        return null;
    }
}

// Hàm fetch có thể nhận phương thức và dữ liệu
export const fetchJSONData = async (path_url:string, method = 'GET', data = null, includeToken = 'access') => {
    try {
        const config: any = {
            method, // HTTP method
            url: path_url, // path of API
            headers: {
                'Content-Type': ['GET', 'POST', 'PUT', 'DELETE'].includes(method)
                    ? 'application/json'
                    : 'application/x-www-form-urlencoded',
            },
        };

        // Add token
        switch (includeToken) {
            case 'refresh':
                const refreshToken = await getRefreshToken();
                if (refreshToken) {
                    config.headers.Authorization = `Bearer ${refreshToken}`;
                }
                break;
            case 'access':
                const accessToken = await getAccessToken();
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                break;
            default:
                break;
        }

        // if different GET method then add data
        if (data) {
            config.data = data;
        }

        const response = await axiosInstance(config);
        return response.data;

    } catch (error) {
        console.error(`Error fetching with: ${path_url}`, error);
        throw error;
    }
};

// Hàm fetch FormData với tùy chọn lấy token
export const fetchFormData = async (path_url:string, method = 'POST', formData:any, includeToken = 'access') => {
    try {
        const config: any = {
            method: method,
            url: path_url,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        // Add token
        switch (includeToken) {
            case 'refresh':
                const refreshToken = await getRefreshToken();
                if (refreshToken) {
                    config.headers.Authorization = `Bearer ${refreshToken}`;
                }
                break;
            case 'access':
                const accessToken = await getAccessToken();
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                break;
            default:
                break;
        }

        // if different GET method then add data
        config.data = formData;

        const response = await axiosInstance(config);
        return response.data;

    } catch (error) {
        console.error(`Error fetching with: ${path_url}`, error);
        throw error;
    }
};
