import { axiosJSONData } from "../config/axios";

// Enum cho loại token
enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    NONE = 'none',
}

class UserFetch {
    private endpoints = {
        register: '/users/register',
        verifyOTP: '/users/register/verify-otp',
        resendOTP: '/users/register/resend-verify-otp',
    };


    /**
     * Register user
     * @param {Record<string, any>} data: { username: string, email: string, password: string }
     * username, password, email is required
     * @returns {Promise<any>}
     */
    async register(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.register, 'POST', data, undefined);
    }

    /**
     * Verify OTP
     * @param {Record<string, any>} data: { email: string, otp: string }
     *
     * @returns {Promise<any>}
     */
    async verifyOTP(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.verifyOTP, 'POST', data, undefined);
    }

    /**
     * Verify OTP
     * @param {Record<string, any>} data: { email: string, otp: string }
     *
     * @returns {Promise<any>}
     */
    async resendOTP(data: Record<string, any>): Promise<any> {
        return axiosJSONData(this.endpoints.resendOTP, 'POST', data, undefined);
    }

}

export default new UserFetch();
