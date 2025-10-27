import axios from "@/app/lib/axios";
import { CountryType } from "@/types/LocationType";

export async function listLocations(limit?: number, offset?: number) {
    const response = await axios.get("/locations", {
        params: { limit, offset },
    });
    return response.data;
}

export async function listStates(limit?: number, offset?: number) {
    const response = await axios.get("/states", {
        params: { limit, offset },
    });
    return response.data;
}

export async function listCities(limit?: number, offset?: number) {
    const response = await axios.get("/cities", {
        params: { limit, offset },
    });
    return response.data;
}

export async function listCountries(limit?: number, offset?: number) {
    const response = await axios.get("/countries", {
        params: { limit, offset },
    });
    return response.data;
}

export async function storeCountry(payload: CountryType) {
    const response = await axios.post("/country/create", payload);
    return response.data;
}
export async function updateCountry(id: number, payload: CountryType) {
    const response = await axios.put(`/country/update/${id}`, payload);
    return response.data;
}

export async function deleteCountry(id: number) {
    const response = await axios.delete(`/country/delete${id}`);
    return response.data;
}