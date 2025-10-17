'use client';
import React from "react";
import OrdersTable from "./components/OrdersTable";
import OrderAreaChart from "./components/OrderAreaChart";
import { MetricCard } from "./components/MetricCard";


export default function Orders() {
    return (
        <div >
            <h1 className="text-2xl font-bold text-gray-950">Orders</h1>
            <p className="text-sm text-gray-500">Manage your customers here.</p>
            <div className="space-y-6 mt-6">
                <MetricCard />
                <OrderAreaChart />
                <OrdersTable limit={10} />
            </div>
        </div>
    );
}
