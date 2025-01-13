import { axiosJSONData } from "../config/axios";

// Enum cho loại token
enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    NONE = 'none',
}

class AuthenFetch {
    private endpoints = {
        logIn: '/auth/log-in',
        logOut: '/auth/log-out',
        register: '/auth/register',
        verifyOTP: '/auth/register/verify-otp',
        validateToken: '/auth/validate-token',
        renewAccessToken: '/auth/renew-access-token',
        getUserInfo: '/auth/user-info'
    };

    async logIn(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.logIn, 'POST', data, TokenType.NONE);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { refresh_token: string }
     * refresh_token is refresh token
     * @returns {Promise<any>}
     */
    async logOut(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.logOut, 'POST', data, undefined);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { firstname: string, lastname: string, email: string, password: string }
     * username, password, email is required
     * @returns {Promise<any>}
     */
    async register(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.register, 'POST', data, undefined);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { email: string, otp: string }
     *
     * @returns {Promise<any>}
     */
    async verifyOTP(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.verifyOTP, 'POST', data, undefined);
    }

    async validateAccessToken(): Promise<any> {
        return axiosJSONData(this.endpoints.validateToken, 'POST', null, TokenType.ACCESS);
    }

    async validateRefreshToken(): Promise<any> {
        return axiosJSONData(this.endpoints.validateToken, 'POST', null, TokenType.REFRESH);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { token: string, type: string }
     * token is fresh token
     * type is 'REFRESH'
     * @returns {Promise<any>}
     */
    async renewAccessToken(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.renewAccessToken, 'POST', data, TokenType.REFRESH);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { token: string, type: string }
     * token is access token
     * type is 'ACCESS'
     * @returns {Promise<any>}
     */
    async getUserInfo(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.getUserInfo, 'POST', data, TokenType.ACCESS);
    }
}

export default new AuthenFetch();
