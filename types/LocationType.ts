export interface CityType {
    id: number;
    name: string;
    state_id: number; 
    country_id: number; 
    updated_at: string;
}
export interface CountryType {
    id?: number;
    name: string;
    flag: string;
    dial_code: string;
    currency: string;
    short_name: string;
}