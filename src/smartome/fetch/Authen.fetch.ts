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
        signUp: '/auth/sign-up',
        logOut: '/auth/log-out',
        register: '/auth/register',
        validateToken: '/auth/validate-token',
        renewAccessToken: '/auth/renew-access-token',
        getUserInfo: '/auth/user-info'
    };

    async logIn(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.logIn, 'POST', data, TokenType.NONE);
    }

    async signUp(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.signUp, 'POST', data, TokenType.ACCESS);
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

    async register(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.register, 'POST', data, TokenType.ACCESS);
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
