import { axiosJSONData } from "../config/axios";

// Enum cho loại token
enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    NONE = 'none',
}

export default new class OwnDeviceFetch {
    private endpoints = {
        create: '/own-device',
        getInfo: '/own-device',
        update: '/own-device',
        delete: '/own-device',
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
     * Get user information
     * @param {Record<string, any>} data: { id_device, name, desc, is_save_state }
     *
     * @returns {Promise<any>}
     */
    async update(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.update, 'PUT', data, TokenType.ACCESS);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { id_device }
     *
     * @returns {Promise<any>}
     */
    async delete(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.delete, 'DELETE', data, TokenType.ACCESS);
    }

}
