import { axiosJSONData } from "../config/axios";

// Enum cho loại token
enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    NONE = 'none',
}

export default new class HouseFetch {
    private endpoints = {
        create: '/houses',
        getInfo: '/houses',
        update: '/houses',
        delete: '/houses',
    };

    /**
     * Create new house
     * @param {Record<string, any>} data: { name, desc, is_wallpaper_blur, is_main_house }
     * name, desc is string
     * is_wallpaper_blur, is_main_house is boolean
     * @returns {Promise<any>}
     */
    async create(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(this.endpoints.create, 'POST', data, TokenType.ACCESS);
    }

    async getInfo(houseId: string): Promise<any> {

        let path = this.endpoints.getInfo + "/" + houseId;

        if (houseId === "") {
            path = this.endpoints.getInfo;
        }

        return await axiosJSONData(path, 'GET', null, TokenType.ACCESS);
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

        return await axiosJSONData(this.endpoints.delete + "/" + data.house_id, 'DELETE', data, TokenType.ACCESS);
    }

}
