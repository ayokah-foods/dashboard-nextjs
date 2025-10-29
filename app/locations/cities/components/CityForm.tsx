"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { listCountries, listStates, storeCity } from "@/app/api_/locations";
import { CountryType, StateType } from "@/types/LocationType";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";

type CityFormProps = {
  onClose: () => void;
  city?: {
    id?: number;
    name?: string;
    state_id?: number;
    country_id?: number;
  };
};

export default function CityForm({ onClose, city }: CityFormProps) {
  const [form, setForm] = useState({
    name: city?.name || "",
    country_id: city?.country_id?.toString() || "",
    state_id: city?.state_id?.toString() || "",
  });

  const [countries, setCountries] = useState<CountryType[]>([]);
  const [states, setStates] = useState<StateType[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCountries, setFetchingCountries] = useState(true);
  const [fetchingStates, setFetchingStates] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<{ label: string; value: string }>({
    label: city?.country_id ? "Loading..." : "Select Country",
    value: city?.country_id?.toString() || "",
  });

  const [selectedState, setSelectedState] = useState<{ label: string; value: string }>({
    label: city?.state_id ? "Loading..." : "Select State",
    value: city?.state_id?.toString() || "",
  });

  // ✅ Fetch Countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await listCountries();
        setCountries(response.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load countries.");
      } finally {
        setFetchingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // ✅ Fetch States when country changes
  useEffect(() => {
    if (!form.country_id) return;
    const fetchStates = async () => {
      try {
        setFetchingStates(true);
        const response = await listStates(Number(form.country_id));
        setStates(response.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load states.");
      } finally {
        setFetchingStates(false);
      }
    };
    fetchStates();
  }, [form.country_id]);

  // ✅ Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, country_id, state_id } = form;
    if (!name || !country_id || !state_id) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("country_id", country_id);
      formData.append("state_id", state_id);

      await storeCity(formData);

      toast.success("City saved successfully.");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save city.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* City Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter city name"
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* ✅ Country Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
        <SelectDropdown
          options={countries.map((c) => ({
            label: c.name,
            value: c.id?.toString() || "",
          }))}
          value={selectedCountry}
          onChange={(selected) => {
            setSelectedCountry(selected);
            setForm({ ...form, country_id: selected.value, state_id: "" });
            setSelectedState({ label: "Select State", value: "" });
          }}
          disabled={fetchingCountries}
          className="w-full"
        />
      </div>

      {/* ✅ State Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
        <SelectDropdown
          options={states.map((s) => ({
            label: s.name,
            value: s.id?.toString() || "",
          }))}
          value={selectedState}
          onChange={(selected) => {
            setSelectedState(selected);
            setForm({ ...form, state_id: selected.value });
          }}
          disabled={!form.country_id || fetchingStates}
          className="w-full"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save City"}
        </button>
      </div>
    </form>
  );
}
