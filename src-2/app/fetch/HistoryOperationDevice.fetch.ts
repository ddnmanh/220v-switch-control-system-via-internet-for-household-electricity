import { axiosJSONData } from "../config/axios";

// Enum cho loại token
enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    NONE = 'none',
}

export default new class HistoryOperationDevice {
    private endpoints = {
        create: '/sys-operation/device',
        getInfo: '/sys-operation/device',
        update: '/sys-operation/device',
        delete: '/sys-operation/device',
    };

    /**
     * Get user information
     * @param {Record<string, any>} data: { house_id, device_id }
     *
     * @returns {Promise<any>}
     */
    async get(data: Record<string, any>): Promise<any> {
        return await axiosJSONData(
            this.endpoints.create + "?house_id=" + data.house_id + "&device_id=" + data.device_id,
            'GET',
            data,
            TokenType.ACCESS
        );
    }

}
