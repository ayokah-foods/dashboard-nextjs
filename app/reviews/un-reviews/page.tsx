"use client";

import React from "react"; 
import UnReviewTable from "../components/UnReviewTable";
export default function Review() {
    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">UnReview orders</h1>
            <p className="text-sm text-gray-600">Manage your Un-Review orders here.</p>

             <UnReviewTable limit={10} />
        </div>
    );
}
