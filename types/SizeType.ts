export interface SizeType {
    data: Sizes[];  
    total: number;
    offset: number;
    limit: number;
}

export interface Sizes {
    id: number;
    name: string;
}