export interface ShortCoords {
    lat: number;
    lng: number;
}

interface Address {
    city: string;
    countryCode: string;
    countryName: string;
    county: string;
    label: string;
    postalCode: string;
    state: string;
    stateCode: string;
}

export interface City {
    id: string;
    title: string;
    position: ShortCoords;
    address: Address;
    drivingTimeA: number;
    drivingTimeB: number;
}

export interface CityResponse extends City {
    distance: number;
}
