"use client";

import { useState, useMemo, useEffect } from "react";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
// ❌ REMOVED: import { useCategoryStore } from "@/store/CategoryStore";
import {
    addCategory,
    getCategories,
    updateCategory,
} from "@/lib/api_/categories";
import toast from "react-hot-toast";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
// Ensure CategoryType is the correct type for the parent categories list!
import {
    CategoryType,
    FlattenedSubCategory,
    CategoryResponse,
} from "@/types/CategoryType";
// Note: You may need to ensure CategoryResponse is imported/available in your types file.

export default function SubCategoryForm({
    onClose,
    category,
}: {
    onClose: () => void;
    category?: FlattenedSubCategory;
}) {
    const [name, setName] = useState(category?.name ?? "");
    const [selectedParent, setSelectedParent] = useState<{
        label: string;
        value: string;
    } | null>(
        category?.parent_id
            ? {
                  label: category.parent_name ?? "",
                  value: String(category.parent_id),
              }
            : null
    );

    // ❌ REMOVED: const { categories, setCategories: saveToStore } = useCategoryStore();

    // Local state for categories, initialized as empty
    const [localCategories, setLocalCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // Start as true since we must fetch

    // ✅ Implemented: useEffect to call getCategories once on mount
    useEffect(() => {
        const fetchCategories = async () => {
            setIsFetching(true);
            try {
                // Assuming getCategories returns the CategoryResponse type
                const response: CategoryResponse = await getCategories(100);

                // ❌ REMOVED: saveToStore(response.data);

                setLocalCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
                toast.error("Failed to load parent categories.");
            } finally {
                setIsFetching(false);
            }
        };

        // Call fetchCategories only once on mount (empty dependency array)
        fetchCategories();
    }, []); // Empty dependency array ensures it runs only on mount

    const categoryOptions = useMemo(() => {
        if (isFetching) {
            return [
                { label: "Loading categories...", value: "", disabled: true },
            ];
        }

        return (
            localCategories
                // Filter out the category being edited itself, to prevent selecting itself as a parent
                .filter((cat) => cat.id !== category?.id)
                .map((cat) => ({
                    label: cat.name,
                    value: String(cat.id),
                }))
        );
    }, [localCategories, isFetching, category?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        if (selectedParent?.value)
            formData.append("parent_id", selectedParent.value);

        try {
            if (category?.id) {
                await updateCategory(category.id, formData);
                toast.success("Sub category updated successfully");
            } else {
                await addCategory(formData);
                toast.success("Sub category added successfully");
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(
                `Failed to ${category?.id ? "update" : "add"} category`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub category Name
                </label>
                <input
                    type="text"
                    placeholder="Enter sub category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Category <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                    options={categoryOptions}
                    value={
                        selectedParent || {
                            label: isFetching
                                ? "Loading..."
                                : "Select category",
                            value: "",
                        }
                    }
                    onChange={(opt) => setSelectedParent(opt)}
                    className="w-full"
                    // Disable dropdown while fetching or if no options are available
                    disabled={isFetching || categoryOptions.length === 0}
                />
                {isFetching && (
                    <p className="text-xs text-amber-600 mt-1">
                        Fetching parent categories...
                    </p>
                )}
            </div>
            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}
