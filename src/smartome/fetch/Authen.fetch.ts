import { fetchJSONData } from "../config/axios";

export default new class AuthenFetch {
    sign_in: string;
    sign_up: string;
    sign_out: string;
    register: string;
    validate_token: string;

    constructor() {
        this.sign_in = '/auth/sign-in';
        this.sign_up = '/auth/sign-up';
        this.sign_out = '/auth/sign-out';
        this.register = '/auth/register';
        this.validate_token = '/auth/validate-token';
    }

    async SignIn(data:any) {
        return await fetchJSONData(this.sign_in, 'POST', data, '');
    }

    async SignUp(data:any) {
        return await fetchJSONData(this.sign_up, 'POST', data, '');
    }

    async SignOut() {
        return await fetchJSONData(this.sign_out, 'POST', null, 'all');
    }

    async Register(data:any) {
        return await fetchJSONData(this.register, 'POST', data, '');
    }

    async ValidateAccessToken() {
        return await fetchJSONData(this.validate_token, 'POST', null, 'access');
    }

    async ValidateRefreshToken() {
        return await fetchJSONData(this.validate_token, 'POST', null, 'refresh');
    }
}
