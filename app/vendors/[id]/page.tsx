"use client";
import { useEffect, useState } from "react";
import { UserDetailResponse } from "@/types/UserType";
import { useParams } from "next/navigation";
import { getUserDetail } from "@/app/api_/users";
import WalletSummary from "../components/WalletSummary";
import ProfileCard from "@/app/customers/components/ProfileCard";
import UserOrders from "@/app/customers/components/UserOrders";
 
export default function VendorDetails() {
    const params = useParams();
    const id = params?.id;
    const type = "vendor";

    const [user, setUser] = useState<UserDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || typeof id !== "string") {
            setError("Invalid customer ID.");
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await getUserDetail(id, type);
                setUser(response.data);
            } catch (err) {
                setError(err as string);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, type, error]);
    return (
        <div className="space-y-6">
            <WalletSummary
                loading={loading}
                totalSpent={user?.wallet?.total_earning ?? 0}
                totalRefunded={user?.wallet?.available_to_withdraw ?? 0}
                totalPending={user?.wallet?.pending ?? 0}
            />
            <ProfileCard user={user} loading={loading} />
            {typeof id === "string" && <UserOrders userId={id} type={type} />}

        </div>
    );
}