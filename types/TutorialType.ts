export interface TutotialType {
    data: Tutorial[];
    total: number;
    limit: number;
    offset: number;
}

export interface Tutorial {
    title: string;
    description: string;
    video_url: string;
    image_url: string;
    image_public_id: string;
    type: string;
    status: string;
    id: string;
}