import { axiosJSONData } from "../config/axios";

// Enum cho loại token
enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    NONE = 'none',
}

export default new class HouseFetch {
    private endpoints = {
        create: '/house',
        getInfo: '/house',
        update: '/house',
        delete: '/house',
    };

    /**
     * Get user information
     * @param {Record<string, any>} data: { name, desc, is_wallpaper_blur }
     * name, desc is string, is_wallpaper_blur is boolean
     * @returns {Promise<any>}
     */
    async create(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.create, 'POST', data, TokenType.ACCESS);
    }

    async getInfo(houseId: string): Promise<any> {
        return await axiosJSONData(this.endpoints.getInfo  + "/" + houseId, 'GET', null, TokenType.ACCESS);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { house_id, name, desc, is_wallpaper_blur, is_main_house }
     * house_id is string, name, desc is string
     * is_wallpaper_blur, is_main_house is boolean
     * @returns {Promise<any>}
     */
    async update(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.update, 'PUT', data, TokenType.ACCESS);
    }

    /**
     * Get user information
     * @param {Record<string, any>} data: { house_id }
     * house_id is string
     * @returns {Promise<any>}
     */
    async delete(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.delete, 'DELETE', data, TokenType.ACCESS);
    }

}
