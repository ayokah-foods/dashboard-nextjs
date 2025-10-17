export interface NotificationType {
    receiver: string;
    body: string;
    image: string;
    image_public_id: string;
    cta: string;
    created_at: string;
    delivery_status: string;
}

export interface NotificationResponse {
    status: "success";
    data: NotificationType[];
    total: number;
    limit: number;
    offset: number;
    stats: {
        total: number;
        email: number;
        sms: number;
        pending: number;
        delivered: number;
        failed: number;
        vendor: number;
        customer: number;
        single: number;
    };
}
