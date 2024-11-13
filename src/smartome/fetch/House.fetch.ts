import { fetchJSONData } from "../config/axios";

export default new class HouseFetch {
    all_houses: string;

    constructor() {
        this.all_houses = '/houses';
    }

    async AllHouses() {
        return await fetchJSONData(this.all_houses, 'POST', null, 'access');
    }
}
