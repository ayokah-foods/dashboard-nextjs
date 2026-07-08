export function getStockBadgeClass(quantity: number, max: number): string {
    if (max === 0) return "bg-gray-100 text-gray-600";

    const percentage = (quantity / max) * 100;

    if (percentage >= 66.67) return "bg-ayokah/10 text-ayokah-secondary";
    if (percentage >= 33.34) return "bg-ayokah-primary text-hub-secondary";
    return "bg-red-100 text-red-700";
}
