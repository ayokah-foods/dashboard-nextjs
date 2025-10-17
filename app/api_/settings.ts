import axios from "../lib/axios";
 

export async function saveAppSettings(data: FormData) {
    const response = await axios.post(`/app-settings`, data);
    return response.data;
}
 
export async function getAppSettings() {
    const response = await axios.get(`/app-setting`);
    return response.data;
}
 

export async function getPolicy(type: string) {
    const response = await axios.get(`/policy/${type}`);
    return response.data;
} 
export async function savePolicy(formData: FormData) {
    const response = await axios.post(`/policy`, formData);
    return response.data;
}