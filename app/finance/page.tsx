'use client';
import { useState } from "react";
import SelectDropdown from "../components/commons/Fields/SelectDropdown";
import FinanceAreaChart from "./components/FinanceAreaChart";
import { Overview } from "./components/Overview";
import { MONTHS } from "../setting";
 
// Convert MONTHS array into dropdown options
const monthOptions = MONTHS.map(month => ({
    label: month,
    value: month,
}));

export default function Finance() {
    const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);  

    return (
        <div className="space-y-6 text-gray-800">

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Finance Overview</h1>
                    <p className="text-sm text-gray-500">Manage your finance overview here.</p>
                </div>

                <div className="w-48">
                    <SelectDropdown
                        options={monthOptions}
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                    />
                </div>
            </div>

            <Overview selectedPeriod={selectedMonth.value} />

            <FinanceAreaChart selectedPeriod={selectedMonth.value} />
        </div>
    );
}
