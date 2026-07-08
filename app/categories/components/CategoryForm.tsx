"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import {
    addCategory,
    updateCategory,
    getCategories,
} from "@/lib/api/categories";
import toast from "react-hot-toast";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import { CategoryType, CategoryResponse } from "@/types/CategoryType";

interface Props {
    onClose: () => void;
    category?: CategoryType;
}

const typeOptions = [
    { label: "Product", value: "products" },
    { label: "Service", value: "services" },
    { label: "Delivery", value: "deliveries" },
];

type DropdownOption = { label: string; value: string };

export default function CategoryForm({ onClose, category }: Props) {
    const [name, setName] = useState(category?.name || "");
    const [selectedParent, setSelectedParent] = useState<DropdownOption | null>(
        category?.parent_id
            ? {
                  label: category.parent_name || "",
                  value: String(category.parent_id),
              }
            : null,
    );
    const [description, setDescription] = useState(category?.description || "");
    const [imagePreview, setImagePreview] = useState<string | null>(
        category?.image || null,
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [type, setType] = useState<DropdownOption | null>(
        category?.type
            ? typeOptions.find((opt) => opt.value === category.type) || null
            : null,
    );
    const [localCategories, setLocalCategories] = useState<CategoryType[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const typeValue = type?.value;
        if (!typeValue) {
            setLocalCategories([]);
            setSelectedParent(null);
            return;
        }

        const fetchCategoriesByType = async () => {
            setIsFetching(true);
            try {
                const response: CategoryResponse = await getCategories(
                    100, // limit
                    0, // offset
                    undefined, // search
                    typeValue, // type
                );

                setLocalCategories(response.data);

                if (
                    selectedParent &&
                    !response.data.some(
                        (cat) => String(cat.id) === selectedParent.value,
                    )
                ) {
                    setSelectedParent(null);
                }
            } catch (error) {
                console.error("Failed to fetch categories by type", error);
                toast.error(
                    `Failed to load parent categories for ${typeValue}.`,
                );
            } finally {
                setIsFetching(false);
            }
        };

        fetchCategoriesByType();
    }, [type, selectedParent]);

    const categoryOptions = useMemo(() => {
        if (isFetching) {
            return [
                { label: "Loading categories...", value: "", disabled: true },
            ];
        }

        return localCategories
            .filter((cat) => String(cat.id) !== String(category?.id))
            .map((cat) => ({
                label: cat.name,
                value: String(cat.id),
            }));
    }, [localCategories, isFetching, category?.id]);

    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 1 * 1024 * 1024; // 1MB (Changed from 3MB in comment)
        const validTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!validTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, or WebP images are allowed");
            e.target.value = ""; // clear file input
            return;
        }

        if (file.size > maxSize) {
            toast.error("Image must be smaller than 1MB");
            e.target.value = "";
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (type?.value) formData.append("type", type.value);
        if (selectedParent?.value)
            formData.append("parent_id", selectedParent.value);
        if (imageFile) formData.append("image", imageFile);

        try {
            if (category?.id) {
                await updateCategory(category.id, formData);
                toast.success("Category updated successfully");
            } else {
                await addCategory(formData);
                toast.success("Category added successfully");
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(
                `Failed to ${category?.id ? "update" : "add"} category`,
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
                    Category Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-hub-primary/200 focus:border-hub-primary"
                />
            </div>

            {/* Type */}
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

            {/* Parent Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Category{" "}
                    <span className="text-hub-primary">(optional)</span>
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
                    // Disable if fetching, no options, or if no Type is selected
                    disabled={
                        isFetching || categoryOptions.length === 0 || !type
                    }
                />
                {isFetching && (
                    <p className="text-xs text-hub-secondary mt-1">
                        Fetching parent categories for {type?.label || "type"}
                        ...
                    </p>
                )}
                {!type && (
                    <p className="text-xs text-red-500 mt-1">
                        Please select a Type to load parent categories.
                    </p>
                )}
            </div>

            {/* Description, Image, and Submit Button sections remain the same */}

            {/* ... (rest of the form remains the same) */}

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={4}
                    maxLength={255}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-hub-primary/200 focus:border-hub-primary"
                    placeholder="Category description"
                />
                <div className="text-sm text-gray-500 mt-1 text-right">
                    {description.length}/255
                </div>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cat Image <span className="text-red-500">*</span>
                </label>

                <label
                    htmlFor="categoryImage"
                    className="relative w-full h-50 aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-hub-primary hover:bg-hub-primary/20 transition-colors overflow-hidden flex items-center justify-center"
                >
                    {/* Image Preview fills label */}
                    {imagePreview ? (
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-green-600">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span className="mt-2 text-sm">
                                Click to upload or drag and drop
                            </span>
                        </div>
                    )}

                    <input
                        id="categoryImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </label>
                {imageFile && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                )}
            </div>
            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}
