export interface CityType {
    id: number;
    name: string;
    state_id: number; 
    state?: StateType;
    country_id: number; 
    country?: CountryType;
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

export interface StateType {
    id?: number;
    name: string;
    country_id: number;
    country?: CountryType;
}