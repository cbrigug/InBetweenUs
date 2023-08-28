interface ShortCoords {
    lat: number;
    lng: number;
}

export interface City {
    title: string;
    position: ShortCoords;
    address: string;
    drivingTimeA: number;
    drivingTimeB: number;
}

export interface CityResponse extends City {
    distance: number;
}
