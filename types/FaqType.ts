export interface Faq {
    question: string;
    answer: string;
    status: string;
    type: string;
    id: string;
}

export interface FaqType {
    total: number;
    limit: number;
    offset: number;
    data: Faq[];
}
