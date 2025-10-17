import Address from "./AddressType";
import Wallet from "./WalletType";

export interface User  {
    id: number;
    name: string;
    last_name: string;
    statephone: string;
    email: string;
    phone: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    role: string;
    is_active: number;
    city: string;
    state: string;
    country: string;
    profile_photo: string;
    google_id: string | null;
    fcm_token: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
};

export interface UserResponse {
    status: "success";
    data: User[];
    total: number;
    limit: number;
    offset: number;
}

export interface UserAdminType {
    id: number;
    name: string;
    last_name: string;
    phone: string;
    email: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    role: string;
    is_active: number;
    city: string;
    state: string;
    country: string;
    profile_photo: string;
    google_id: string | null;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
}

export interface UserDetailResponse {
    id: number;
    name: string;
    last_name: string;
    phone: string;
    email: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    role: "customer" | "vendor" | string;
    is_active: boolean;
    city: string;
    state: string;
    country: string;
    profile_photo: string;
    google_id: string | null;
    fcm_token: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    address: Address;
    wallet: Wallet;
}

export interface Activities {
    id: number;
    user_id: number;
    role: string;
    login_time: string;
    activity: string;
    ip: string;
    location: string;
    device: string;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface ActivityResponse {
    status: "success";
    data: Activities[];
    total: number;
    limit: number;
    offset: number;
}
