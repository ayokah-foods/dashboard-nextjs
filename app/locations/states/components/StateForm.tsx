"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import { storeState, listCountries } from "@/lib/api/locations";
import { CountryType, StateType } from "@/types/LocationType";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";

export default function StateForm({
    onClose,
    state,
}: {
    onClose: () => void;
    state?: StateType;
}) {
    const [form, setForm] = useState({
        name: state?.name || "",
        country_id: state?.country_id || "",
    });

    const [countries, setCountries] = useState<CountryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCountries, setFetchingCountries] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setFetchingCountries(true);
                const response = await listCountries();
                setCountries(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load countries.");
            } finally {
                setFetchingCountries(false);
            }
        };

        fetchCountries();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { name, country_id } = form;
        if (!name || !country_id) {
            toast.error("Both fields are required.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("country_id", String(country_id));
            await storeState(formData);
            toast.success("State saved successfully.");
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save state.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province Name
                </label>
                <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-hub-primary/200"
                    placeholder="e.g. London"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Country
                </label>
                <SelectDropdown
                    disabled={fetchingCountries}
                    options={countries.map((c) => ({
                        label: c.name,
                        value: String(c.id),
                    }))}
                    value={
                        form.country_id
                            ? {
                                  label:
                                      countries.find(
                                          (c) =>
                                              c.id === Number(form.country_id),
                                      )?.name || "Select Country",
                                  value: String(form.country_id),
                              }
                            : { label: "Select Country", value: "" }
                    }
                    onChange={(selected) =>
                        setForm((prev) => ({
                            ...prev,
                            country_id: Number(selected.value),
                        }))
                    }
                    className="w-full"
                />
            </div>
            <SubmitButton loading={loading} label="Save State" />
        </form>
    );
}
