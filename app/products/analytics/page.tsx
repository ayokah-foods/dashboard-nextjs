'use client';
import AnalysisAreaChart from "../components/AnalysisAreaChart";
import MostSellingProductsTable from "../components/MostSellingProductsTable";

export default function Analytics() {

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-950">Most selling items</h1>
            <p className="text-gray-700 text-sm mb-6">Manage your most selling items here.</p>

            <AnalysisAreaChart />
            <MostSellingProductsTable limit={10} />
        </div>
    );
}