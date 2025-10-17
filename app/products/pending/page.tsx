'use client';

import { useState } from "react";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import ProductsTable from "../components/ItemsTable";

export default function Pending() {
     const [selectedType, setSelectedType] = useState({
        label: "Product Items",
        value: "products",
      });
    return (
        <div className="space-y-6 text-gray-800">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pending products</h1>
          <p className="text-sm text-gray-600">Manage your pending products here.</p>
        </div>

        <div className="w-48">
          <SelectDropdown
            options={[
              { label: "Product Items", value: "products" },
              { label: "Service Items", value: "services" },
            ]}
            value={selectedType}
            onChange={setSelectedType}
          />
        </div>
      </div>



      {/* Products Table */}
      <ProductsTable limit={10} type={selectedType.value} status="inactive" />
    </div>
    );
}