"use client";

import React from "react";
import { ReviewMetrics } from "./components/ReviewMetrics";
import ReviewTable from "./components/ReviewTable";

export default function Review() {
    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Order Review</h1>
            <p className="text-sm text-gray-600">Manage your Order Review here.</p>

            <ReviewMetrics />
            <ReviewTable limit={10} />
        </div>
    );
}
