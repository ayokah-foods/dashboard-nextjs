import Image from "next/image";
import { formatAmount } from "@/utils/formatCurrency";
import parse from "html-react-parser";

export default function ProductCard({
    product,
    activeImage,
    setActiveImage,
    quantity,
    unitPrice,
}: any) {
    return (
        <div className="col-span-1 flex flex-col gap-4">
            <div className="border border-orange-100 rounded-md overflow-hidden">
                {activeImage ? (
                    <div className="relative w-full h-56">
                        <Image
                            src={activeImage}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-56 flex items-center justify-center text-gray-400">
                        No image
                    </div>
                )}
                <div className="p-3 flex gap-2 overflow-x-auto">
                    {product.images?.slice(0, 3).map((img: string) => (
                        <button
                            key={img}
                            onClick={() => setActiveImage(img)}
                            className="w-20 h-20 rounded-md overflow-hidden border border-orange-100"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={img}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold truncate text-gray-800">
                    {product.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                    {product.description ? parse(product.description) : ""}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="font-mono text-sm">{product.sku}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Qty</p>
                    <p className="font-medium">{quantity}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Unit price</p>
                    <p className="font-medium">
                        {formatAmount(Number(unitPrice))}
                    </p>
                </div>
            </div>
        </div>
    );
}
