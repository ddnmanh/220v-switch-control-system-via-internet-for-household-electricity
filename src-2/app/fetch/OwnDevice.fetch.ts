import { axiosJSONData } from "../config/axios";

// Enum cho loại token
enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    NONE = 'none',
}

export default new class OwnDeviceFetch {
    private endpoints = {
        create: '/own-devices',
        getInfo: '/own-devices',
        update: '/own-devices',
        updateSetting: '/own-devices/setting',
        delete: '/own-devices',
        history: '/own-devices/operations',
    };

    /**
     * Get user information
     * @param {Record<string, any>} data: { id_device, id_house, id_area, id_device, name, desc }
     *
     * @returns {Promise<any>}
     */
    async create(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.create, 'POST', data, TokenType.ACCESS);
    }

    /**
     * Update own device information
     * @param {Record<string, any>} data: { id, name, desc, is_save_state }
     * id is id_own_device
     * @returns {Promise<any>}
     */
    async update(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.update, 'PUT', data, TokenType.ACCESS);
    }

    /**
     * Update setting for own device
     * @param {Record<string, any>} data: { id_own_device, is_save_state, is_reset_confirm }
     *
     * @returns {Promise<any>}
     */
    async updateSetting(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.updateSetting, 'PUT', data, TokenType.ACCESS);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { id_device }
     *
     * @returns {Promise<any>}
     */
    async delete(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.delete +"/"+data.id_own_device, 'DELETE', data, TokenType.ACCESS);
    }

    /**
     * Get history operation of own device
     * @param {Record<string, any>} data: { id_device }
     *
     * @returns {Promise<any>}
     */
    async historyOperation(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.history +"/"+data.id_own_device, 'GET', data, TokenType.ACCESS);
    }

}
