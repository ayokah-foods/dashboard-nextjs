"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../lib/api_/login";
import toast from "react-hot-toast";
import { SubmitButton } from "../../components/commons/SubmitButton";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
            const result = await login(formData);

            document.cookie = `token=${result.token}; path=/; max-age=86400; Secure; SameSite=Strict`;
            document.cookie = `user=${encodeURIComponent(
                JSON.stringify(result.data)
            )}; path=/; max-age=86400; Secure; SameSite=Strict`;

            if (!result.data.password_changed_at) {
                toast("You must change your password before continuing");
                router.replace("/auth/change-password");
                return;
            }
            toast.success("Login successful");
            router.push("/");
        } catch {
            toast.error("Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <> 
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Administration
            </h1>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4 text-gray-800"
            >
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Business Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email Address"
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your Password"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <div className="text-right mt-1">
                        <Link
                            href="/auth/forget-password"
                            className="text-sm text-orange-800 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                <SubmitButton label="Log in" loading={isLoading} />
            </form>
        </>
    );
}
