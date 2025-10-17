import axios from "../lib/axios";

export async function addBanner(formData: FormData) {
    const response = await axios.post("/banners/create", formData, {
        headers: {
            Accept: "application/json",
        },
    });
    return response.data;
}

export async function updateBanner(bannerId: number, formData: FormData) {
    const response = await axios.put(`/banners/${bannerId}/update`, formData, {
        headers: {
            Accept: "application/json",
        },
    });
    return response.data;
}

export async function deleteBanner(bannerId: number) {
    const response = await axios.delete(`/banners/${bannerId}/delete`);
    return response.data;
}

export async function addBannerType(formData: FormData) {
    const response = await axios.post("/banner/type/create", formData);
    return response.data;
}

export async function listBannerTypes(limit?: number, offset?: number) {
    const response = await axios.get(`/banner/type`, {
        params: { limit, offset },
    });
    return response.data;
}

export async function deleteBannerType(bannerTypeId: number) {
    const response = await axios.delete(`/banner/type/${bannerTypeId}/delete`);
    return response.data;
}
