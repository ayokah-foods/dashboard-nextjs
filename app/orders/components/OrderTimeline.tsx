import dayjs from "dayjs";

export default function OrderTimeline({
    timeline, 
}: any) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 uppercase mb-4">
                Order timeline
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:gap-8">
                {timeline.map((t: any, idx: number) => (
                    <div
                        key={idx}
                        className="flex items-start md:items-center gap-4 mb-4 md:mb-0"
                    >
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    t.done
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-500"
                                }`}
                            >
                                {t.done ? "✓" : idx + 1}
                            </div>
                            {idx !== timeline.length - 1 && (
                                <div className="w-px h-10 bg-gray-200 mt-2" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">
                                {t.label}
                            </p>
                            <p className="text-xs text-gray-500">
                                {t.ts
                                    ? dayjs(t.ts).format("DD MMM YYYY, HH:mm")
                                    : "Pending"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
