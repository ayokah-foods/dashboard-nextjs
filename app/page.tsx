"use client";

import React, { useState } from "react";
import AreaChart from "@/app/components/commons/AreaChart";
import { RecentReviews } from "./components/Review";
import { Greetings } from "@/utils/Greetings";
import Overview from "./components/Overview"; 
import SelectDropdown from "./components/commons/Fields/SelectDropdown";
import RecentOrdersTable from "./orders/components/RecentOrdersTable";

const periods = [
    { value: "all", label: "All" },
    { value: "this_week", label: "This week" },
    { value: "last_week", label: "Last week" },
    { value: "last_month", label: "Last month" },
    { value: "last_year", label: "Last year" },
];

const Home: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);

    return (
        <div className="space-y-4 text-gray-700">
            <div className="flex items-center justify-between">
                <Greetings userName="David" />
                <SelectDropdown
                    options={[
                        { value: "all", label: "All" },
                        { value: "this_week", label: "This week" },
                        { value: "last_week", label: "Last week" },
                        { value: "last_month", label: "Last month" },
                        { value: "last_year", label: "Last year" },
                    ]}
                    value={selectedPeriod}
                    onChange={setSelectedPeriod}
                />
            </div>

            <Overview period={selectedPeriod.value} />

            <div className="flex justify-between gap-4">
                <div className="card w-[70%]">
                    <AreaChart />
                </div>
                <div className="card w-[30%] p-6">
                    <RecentReviews />
                </div>
            </div>

            <RecentOrdersTable limit={10} />
        </div>
    );
};

export default Home;
