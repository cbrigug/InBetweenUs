import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonLoading,
    IonPage,
    IonRange,
    IonRow,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
    useIonToast,
} from "@ionic/react";
import "./Results.css";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import {
    chevronExpandOutline,
    helpCircleOutline,
    refreshOutline,
} from "ionicons/icons";
import axios, { all } from "axios";
import GoogleMapsLink from "../components/GoogleMapsLink";
import { convertSecondsToHoursMinutes } from "../utils/timeUtils";
import { environment } from "../../environment.dev";
import Map from "../components/Map";
import React from "react";
import NoResultsFound from "../components/NoResultsFound";
import { findMidpoint } from "../utils/midpointUtils";
import { Coordinates, addDistanceToCenterCoords } from "../utils/distanceUtils";
import { City, CityResponse } from "../interfaces/City";

interface ResultsProps {
    personAZip: string;
    personBZip: string;
}

const GOOGLE_API_KEY = environment.REACT_APP_GOOGLE_API_KEY;
const HERE_API_KEY = environment.REACT_APP_HERE_API_KEY;

interface CachedCityData {
    flexibility: number;
    personAZip: string;
    personBZip: string;
    cities: City[];
}

interface ZipToCoordsCache {
    [zip: string]: Coordinates;
}
const zipToCoordsCache: ZipToCoordsCache = {};
const cachedDriveData = localStorage.getItem("driveDataCache");
const driveDataCache = cachedDriveData ? JSON.parse(cachedDriveData) : {};

const zipToCoords = async (zip: string) => {
    try {
        if (zipToCoordsCache[zip]) {
            return zipToCoordsCache[zip];
        }
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            const coords = { longitude: lng, latitude: lat };

            // Cache the coordinates
            zipToCoordsCache[zip] = coords;

            return coords;
        } else {
            throw new Error("No coordinates found for the given zip code.");
        }
    } catch (error) {
        console.error("Error converting zip code to coordinates:", error);
        throw error;
    }
};

interface DistanceMatrixResponse {
    rows: {
        elements: {
            duration: {
                value: number;
            };
            distance: {
                value: number;
            };
        }[];
    }[];
}

interface DrivingTime {
    time: number;
    distance: number;
}

async function getDriveData(start: string, end: string): Promise<DrivingTime> {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${start}&destinations=${end}&key=${GOOGLE_API_KEY}`;
    if (driveDataCache[`${start}-${end}`]) {
        return driveDataCache[`${start}-${end}`];
    }
    const response = await axios.get<DistanceMatrixResponse>(url);
    const drivingTime = response.data.rows[0].elements[0].duration?.value;
    const distance = response.data.rows[0].elements[0].distance?.value;
    driveDataCache[`${start}-${end}`] = { time: drivingTime, distance };

    localStorage.setItem("driveDataCache", JSON.stringify(driveDataCache));

    return { time: drivingTime, distance: distance };
}

async function getCitiesByRadius(
    personA: Coordinates,
    personB: Coordinates,
    center: Coordinates,
    flexibility: number
): Promise<City[]> {
    const radius = 24140; // radius in meters (15 miles)
    const latitude = center.latitude;
    const longitude = center.longitude;

    if (flexibility === 0) {
        const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?in=circle:${latitude},${longitude};r=${radius}&types=city&limit=25&apiKey=${HERE_API_KEY}`;
        const response = await axios.get(url);

        return response.data.items.filter((item: City, index: number) => {
            return index % 4 === 0;
        });
    }

    let cities: CityResponse[] = [];
    const newCoords = addDistanceToCenterCoords(
        personA,
        personB,
        center,
        radius,
        flexibility
    );

    for (const coords of [newCoords.halfOne, newCoords.halfTwo]) {
        const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?in=circle:${coords.latitude},${coords.longitude};r=${radius}&types=city&limit=20&apiKey=${HERE_API_KEY}`;
        const response = await axios.get(url);
        // push every tenth city
        cities.push(
            ...response.data.items.filter(
                (item: CityResponse, index: number) => {
                    return index % 10 === 0;
                }
            )
        );
    }

    // sort by distance
    return cities.sort((a: CityResponse, b: CityResponse) => {
        const distanceA = a.distance;
        const distanceB = b.distance;
        return distanceA - distanceB;
    });
}

async function findLocationsToMeet(
    personA: Coordinates,
    personB: Coordinates,
    flexibility: number
): Promise<City[]> {
    const midpoint = await findMidpoint(personA, personB);
    const cities = getCitiesByRadius(personA, personB, midpoint, flexibility);

    return cities;
}

const Results: React.FC = () => {
    const location = useLocation();
    const { personAZip, personBZip } = (location.state as ResultsProps) || {};

    const [middleCityList, setMiddleCityList] = useState<City[]>([]);
    const [index, setIndex] = useState(0);

    const [personACoords, setpersonACoords] = useState<Coordinates>({
        latitude: 0,
        longitude: 0,
    });
    const [personBCoords, setpersonBCoords] = useState<Coordinates>({
        latitude: 0,
        longitude: 0,
    });

    const [flexibility, setFlexibility] = useState(0);

    const [present] = useIonToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showHelpText, setShowHelpText] = useState(false);

    const presentToast = (position: "top" | "middle" | "bottom") => {
        present({
            message: "No cities found!",
            duration: 500,
            color: "warning",
            position: position,
        });
    };
    const [cachedCities, setCachedCities] = useState<CachedCityData[]>([]);

    useEffect(() => {
        const fetchCoords = async () => {
            try {
                if (personAZip && personBZip) {
                    setIsLoading(true);
                    const personACoords = await zipToCoords(personAZip);
                    const personBCoords = await zipToCoords(personBZip);
                    setpersonACoords(personACoords);
                    setpersonBCoords(personBCoords);

                    const cachedDataForCurrentFlexibility = cachedCities.find(
                        (cachedCity) =>
                            cachedCity.flexibility === flexibility &&
                            cachedCity.personAZip === personAZip &&
                            cachedCity.personBZip === personBZip
                    );

                    if (cachedDataForCurrentFlexibility) {
                        setMiddleCityList(
                            cachedDataForCurrentFlexibility.cities
                        );
                        setIsLoading(false);
                    } else {
                        const locations = await findLocationsToMeet(
                            personACoords,
                            personBCoords,
                            flexibility
                        );

                        const personAStart = `${personACoords.latitude},${personACoords.longitude}`;
                        const personBStart = `${personBCoords.latitude},${personBCoords.longitude}`;
                        const allCities = await Promise.all(
                            locations.map(async (location) => {
                                const middle = `${location.position.lat},${location.position.lng}`;
                                return {
                                    ...location,
                                    address: location.title,
                                    drivingTimeA: (
                                        await getDriveData(personAStart, middle)
                                    ).time,
                                    drivingTimeB: (
                                        await getDriveData(personBStart, middle)
                                    ).time,
                                };
                            })
                        );

                        allCities.sort((a, b) => {
                            const differenceA = Math.abs(
                                a.drivingTimeA - a.drivingTimeB
                            );
                            const differenceB = Math.abs(
                                b.drivingTimeA - b.drivingTimeB
                            );
                            return differenceA - differenceB;
                        });

                        setMiddleCityList(allCities);
                        if (allCities.length > 0) {
                            const newCachedCityData = {
                                flexibility,
                                personAZip,
                                personBZip,
                                cities: allCities,
                            };
                            setCachedCities([
                                ...cachedCities,
                                newCachedCityData,
                            ]);
                        }
                        setIsLoading(false);
                    }
                }
            } catch (error) {
                console.error("Error: ", error);
                setMiddleCityList([]);
                setIsLoading(false);
                presentToast("bottom");
            }
        };

        fetchCoords();
    }, [personAZip, personBZip, flexibility]);

    const findAnother = (index: number) => {
        const nextIndex = (index + 1) % middleCityList.length; // Calculate the next index cyclically
        setIndex(nextIndex);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Results</IonTitle>
                    <IonButtons slot="end">
                        <IonIcon
                            icon={helpCircleOutline}
                            size="large"
                            onClick={() => setShowHelpText(!showHelpText)}
                        />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="results-container">
                    {middleCityList[index] ? (
                        <>
                            <IonGrid>
                                <IonRow>
                                    <IonCol>
                                        <GoogleMapsLink
                                            formattedAddress={
                                                middleCityList[index].address
                                            }
                                        />
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonText color="medium">
                                            Person A:{" "}
                                            {convertSecondsToHoursMinutes(
                                                middleCityList[index]
                                                    .drivingTimeA
                                            )}
                                        </IonText>
                                    </IonCol>
                                    <IonCol>
                                        <IonText color="medium">
                                            Person B:{" "}
                                            {convertSecondsToHoursMinutes(
                                                middleCityList[index]
                                                    .drivingTimeB
                                            )}
                                        </IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonRange
                                            onIonChange={(e) => {
                                                setIndex(0);
                                                setFlexibility(
                                                    e.detail.value as number
                                                );
                                            }}
                                            ticks={true}
                                            snaps={true}
                                            min={0}
                                            max={3}
                                        >
                                            <IonIcon
                                                icon={chevronExpandOutline}
                                                slot="end"
                                            />
                                        </IonRange>
                                    </IonCol>
                                </IonRow>
                                {showHelpText && (
                                    <IonRow>
                                        <IonCol>
                                            <IonText
                                                color="medium"
                                                id="help-text"
                                            >
                                                Adjust slider to increase the
                                                bounds of places to meet (this
                                                typically results in longer
                                                driving times).
                                            </IonText>
                                        </IonCol>
                                    </IonRow>
                                )}
                                <IonRow>
                                    <IonCol>
                                        <IonButton
                                            disabled={isLoading}
                                            expand="block"
                                            onClick={() => findAnother(index)}
                                        >
                                            Find Another ({index + 1} /{" "}
                                            {middleCityList.length})
                                            {isLoading ? (
                                                <IonSpinner name="lines-sharp-small" />
                                            ) : (
                                                <IonIcon
                                                    icon={refreshOutline}
                                                    slot="end"
                                                />
                                            )}
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <Map
                                            center={{
                                                latitude:
                                                    middleCityList[index]
                                                        .position.lat,
                                                longitude:
                                                    middleCityList[index]
                                                        .position.lng,
                                            }}
                                            personA={personACoords}
                                            personB={personBCoords}
                                        />
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </>
                    ) : (
                        <NoResultsFound />
                    )}
                </div>
                <IonLoading isOpen={isLoading} />
            </IonContent>
        </IonPage>
    );
};

export default Results;
