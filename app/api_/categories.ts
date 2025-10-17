import { CategoryAnalyticsType } from "@/types/CategoryType";
import axios from "@/app/lib/axios";

export async function getCategories(
    limit?: number,
    offset?: number,
    search?: string,
    type?: string
) {
    const response = await axios.get("/categories", {
        params: { limit, offset, type, search },
    });
    return response.data;
}

export async function listSubCategories(
    limit?: number,
    offset?: number,
    search?: string,
    type?: string
) {
    const response = await axios.get("/subcategories", {
        params: { limit, offset, type, search },
    });
    return response.data;
}

export async function updateCategoryStatus(categoryId: number, status: string) {
    const response = await axios.patch(
        `/category/${categoryId}/status/${status}`
    );
    return response.data;
}

export async function deleteCategory(categoryId: number) {
    const response = await axios.delete(`/category/${categoryId}/delete`);
    return response.data;
}

export async function addCategory(formData: FormData) {
    const response = await axios.post("/category/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
    });

    return response.data;
}

export async function updateCategory(categoryId: number, formData: FormData) {
    const response = await axios.post(
        `/category/${categoryId}/update`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return response.data;
}

export async function listBanners(limit?: number, offset?: number) {
    const response = await axios.get("/banners", {
        params: { limit, offset },
    });
    return response.data;
}

export async function categoryAnalytics(params: {
    limit: number;
    offset: number;
}): Promise<CategoryAnalyticsType> {
    const response = await axios.get<CategoryAnalyticsType>(
        "/category-analytics",
        {
            params,
        }
    );
    return response.data;
}
