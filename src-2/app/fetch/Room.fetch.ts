import { axiosJSONData } from "../config/axios";

// Enum cho loại token
enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    NONE = 'none',
}

export default new class RoomFetch {
    private endpoints = {
        create: '/rooms',
        getInfo: '/rooms',
        update: '/rooms',
        delete: '/rooms',
    };

    /**
     * Create room
     * @param {Record<string, any>} data: { name, desc }
     *
     * @returns {Promise<any>}
     */
    async create(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.create, 'POST', data, TokenType.ACCESS);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { room_id, name, desc }
     *
     * @returns {Promise<any>}
     */
    async update(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.update, 'PUT', data, TokenType.ACCESS);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { room_id }
     *
     * @returns {Promise<any>}
     */
    async delete(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.delete + "/" + data.room_id, 'DELETE', data, TokenType.ACCESS);
    }

}
