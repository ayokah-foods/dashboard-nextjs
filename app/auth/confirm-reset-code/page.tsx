'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { confirmResetCode } from "../../api_/login";
import Image from "next/image";
import toast from "react-hot-toast";
import { SubmitButton } from "../../components/commons/SubmitButton";

type ErrorResponse = {
    message?: string;
    status?: string;
    error_detail?: string;
};

export default function ConfirmResetCode() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedEmail = sessionStorage.getItem("resetEmail");
        if (savedEmail) {
            setEmail(savedEmail);
        } else {
            router.replace("/auth/forget-password");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("otp", code);
        formData.append("email", email);

        try {
            setLoading(true);
            const result = await confirmResetCode(formData);

            toast.success(result.message || "Code confirmed successfully.");
            router.replace("/auth/reset-password");
        } catch (err) {
            const error = err as { response?: { data?: ErrorResponse } };
            const errorDetail =
                error.response?.data?.error_detail ||
                error.response?.data?.message ||
                "Invalid reset code";
            toast.error(errorDetail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            <div
                className="w-1/2 bg-cover bg-center"
                style={{ backgroundImage: "url('/login.png')" }}
            ></div>

            <div className="w-1/2 flex flex-col justify-center items-center px-8">
                <Image
                    width={200}
                    height={200}
                    src="/logo.svg"
                    alt="Logo"
                    className="mb-10"
                />

                <h1 className="text-2xl font-bold mb-6">Confirm Reset Code</h1>

                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Reset Code
                        </label>
                        <input
                            type="tel"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter the code from your email"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                            required
                        />
                    </div>

                    <SubmitButton label="Verify Code" loading={loading} />
                </form>
            </div>
        </div>
    );
}
