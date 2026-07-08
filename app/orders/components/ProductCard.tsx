import Image from "next/image";
import parse from "html-react-parser";
import Link from "next/link";

export default function ProductCard({
    product,
    activeImage,
    setActiveImage,
}: any) {
    return (
        <div className="col-span-1 flex flex-col gap-4">
            <div className="border border-hub-primary/50 rounded-md overflow-hidden">
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
                            className="w-20 h-20 rounded-md overflow-hidden border border-hub-primary/50"
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
                    <Link
                        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/items/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-hub-secondary hover:underline transition-colors"
                    >
                        {product.title}
                    </Link>
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                    {product.description ? parse(product.description) : ""}
                </p>
            </div>
        </div>
    );
}
