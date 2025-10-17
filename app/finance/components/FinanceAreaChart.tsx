"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { formatDate } from "@/utils/formatHumanReadableDate";
 import AreaChartSkeleton from "@/app/components/Skeletons/AreaChartSkeleton";
import { getFinanceGraph } from "@/app/api_/finance";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AreaChartProps {
    selectedPeriod: string;  
}

const FinanceAreaChart = ({ selectedPeriod }: AreaChartProps) => {
    const [chartData, setChartData] = useState<{ categories: string[]; series: number[] }>({
        categories: [],
        series: [],
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [hasData, setHasData] = useState<boolean>(false);

    const fetchChartData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getFinanceGraph({ start_date: selectedPeriod }); 
            const raw = response.data ?? [];
            if (response?.status === "success" && Array.isArray(raw) && raw.length > 0) {
                const categories = raw.map((item: { day: string }) => formatDate(new Date(item.day)));
                const series = raw.map((item: { total: string }) => parseFloat(item.total));
                setChartData({ categories, series });
                setHasData(true);
            } else {
                setChartData({ categories: [], series: [] });
                setHasData(false);
            }
        } catch (error) {
            console.error("Failed to fetch sales graph data:", error);
            setHasData(false);
        } finally {
            setLoading(false);
        }
    }, [selectedPeriod]);  

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    const options: ApexOptions = useMemo(() => ({
        chart: {
            type: "area",
            height: 350,
            toolbar: { show: false },
            background: "transparent",
            zoom: { enabled: true },
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: { top: 10, bottom: 0, left: 10, right: 10 },
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: "smooth",
            width: 1.5,
            colors: ["#F97316"],
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical",
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100],
            },
            colors: ["#F97316"],
        },
        series: [{ name: "Total Earned", data: chartData.series }],
        xaxis: {
            categories: chartData.categories,
            labels: { style: { colors: "#a1a1aa" } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: "#a1a1aa" },
                formatter: (val) => Math.round(val).toLocaleString(),
            },
        },
        tooltip: {
            theme: "dark",
            y: { formatter: (val) => val.toLocaleString() },
        },
        markers: {
            size: 4,
            colors: ["#F97316"],
            strokeColors: "#ffffff",
            strokeWidth: 2,
            hover: { size: 6 },
        },
    }), [chartData]);

    return (
        <div className="p-6 card text-gray-950">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Revenue Graph</h2>
             </div>

            {loading ? (
                <AreaChartSkeleton />
            ) : hasData ? (
                <ReactApexChart options={options} series={options.series} type="area" height={300} />
            ) : (
                <div className="text-center text-black py-10">
                    No data available for {selectedPeriod}.
                </div>
            )}
        </div>
    );
};

export default FinanceAreaChart;
