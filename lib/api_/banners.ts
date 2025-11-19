import axios from "../axios";

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
    const response = await axios.get(`/banner-types`, {
        params: { limit, offset },
    });
    return response.data;
}

export async function deleteBannerType(bannerTypeId: number) {
    const response = await axios.delete(`/banner/type/${bannerTypeId}/delete`);
    return response.data;
}
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL_ || "http://localhost:8000/api";

export async function getBannerByType(
    type: string
): Promise<{ status: string; data: { banner: string } }> {
    const fullUrl = `${API_BASE_URL}/banner/${type}`;
    const response = await axios.get(fullUrl);
    return response.data;
}