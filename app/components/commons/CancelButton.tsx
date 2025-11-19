type CancelButtonProps = {
    label?: string;
    onClick: () => void;
};

export function CancelButton({ label = "Cancel", onClick }: CancelButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
            {label}
        </button>
    );
}
