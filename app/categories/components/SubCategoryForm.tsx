"use client";

import { useState, useMemo, useEffect } from "react";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import {
    addCategory,
    getCategories,
    updateCategory,
} from "@/lib/api_/categories";
import toast from "react-hot-toast";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import {
    CategoryType,
    FlattenedSubCategory,
    CategoryResponse,
} from "@/types/CategoryType";

const typeOptions = [
    { label: "Product", value: "products" },
    { label: "Service", value: "services" },
];
type DropdownOption = { label: string; value: string };

export default function SubCategoryForm({
    onClose,
    category,
}: {
    onClose: () => void;
    category?: FlattenedSubCategory;
}) {
    const [name, setName] = useState(category?.name ?? "");
    const [selectedParent, setSelectedParent] = useState<DropdownOption | null>(
        category?.parent_id
            ? {
                  label: category.parent_name ?? "",
                  value: String(category.parent_id),
              }
            : null
    );

    const [type, setType] = useState<DropdownOption | null>(
        category?.parent_name && category.parent_type
            ? typeOptions.find((opt) => opt.value === category.parent_type) ||
                  null
            : null
    );
    // Local state for categories, initialized as empty
    const [localCategories, setLocalCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // Start as true since we must fetch

    // ✅ Implemented: useEffect to call getCategories once on mount
    useEffect(() => {
        // Only fetch if a type is selected
        if (!type?.value) {
            setLocalCategories([]); // Clear categories if type is deselected
            setSelectedParent(null); // Clear selected parent
            setIsFetching(false);
            return;
        }

        const fetchCategories = async (typeValue: string) => {
            setIsFetching(true);
            // Clear current list and selected parent while fetching new data
            setLocalCategories([]);
            setSelectedParent(null);

            try {
                // Call API using the selected 'type' parameter
                const response: CategoryResponse = await getCategories(
                    100,
                    0,
                    undefined,
                    typeValue
                );

                setLocalCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories by type", error);
                toast.error(
                    "Failed to load parent categories for the selected type."
                );
            } finally {
                setIsFetching(false);
            }
        };

        fetchCategories(type.value);
    }, [type]); // 🔑 Dependency array watches the 'type' state

    const categoryOptions = useMemo(() => {
        if (isFetching) {
            return [
                { label: "Loading categories...", value: "", disabled: true },
            ];
        }

        return (
            localCategories
                // Filter out the category being edited itself
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

            {/* 3. New Type Select Dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                    options={typeOptions}
                    value={type || { label: "Select type", value: "" }}
                    onChange={(opt) => setType(opt)}
                    className="w-full"
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
                                : type
                                ? "Select category"
                                : "Select Type first", // Guidance added
                            value: "",
                        }
                    }
                    onChange={(opt) => setSelectedParent(opt)}
                    className="w-full"
                    // Disable if fetching or if no options are available OR if no Type is selected
                    disabled={
                        isFetching || categoryOptions.length === 0 || !type
                    }
                />
                {isFetching && (
                    <p className="text-xs text-amber-600 mt-1">
                        Fetching parent categories for{" "}
                        {type?.label || "selected type"}...
                    </p>
                )}
                {!type && (
                    <p className="text-xs text-red-500 mt-1">
                        Please select a Type to load parent categories.
                    </p>
                )}
            </div>
            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}
