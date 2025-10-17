'use client';
import React from "react";
import { MetricCard } from "./components/MetricCard";
import BookingsTable from "./components/BookingsTable";
import BookingAreaChart from "./components/BookingAreaChart";


export default function Bookings() {
    return (
        <div >
            <h1 className="text-2xl font-bold text-gray-950">Bookings</h1>
            <p className="text-sm text-gray-500">Manage your customers bookings here.</p>
            <div className="space-y-6 mt-6">
                <MetricCard />
                <BookingAreaChart />
                <BookingsTable limit={10} />
            </div>
        </div>
    );
}
