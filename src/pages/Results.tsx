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
    home,
    newspaper,
    refreshOutline,
} from "ionicons/icons";
import { convertSecondsToHoursMinutes } from "../utils/timeUtils";
import { environment } from "../../environment.dev";
import React from "react";
import NoResultsFound from "../components/NoResultsFound";
import { findMidpoint } from "../utils/midpointUtils";
import { Coordinates, addDistanceToCenterCoords } from "../utils/distanceUtils";
import { City, CityResponse } from "../interfaces/City";
import { CapacitorHttp } from "@capacitor/core";
import { FormDataType } from "../components/PersonCard/PersonModal";

interface ResultsProps {
    personA: FormDataType;
    personB: FormDataType;
}

const GOOGLE_API_KEY = environment.REACT_APP_GOOGLE_API_KEY;
const HERE_API_KEY = environment.REACT_APP_HERE_API_KEY;

interface CachedCityData {
    flexibility: number;
    personA: string;
    personB: string;
    cities: City[];
}

interface AddressToCoordsCache {
    [key: string]: Coordinates;
}

const cachedDriveData = localStorage.getItem("driveDataCache");
const driveDataCache = cachedDriveData ? JSON.parse(cachedDriveData) : {};

interface DrivingTime {
    time: number;
    distance: number;
}

async function getDriveData(start: string, end: string): Promise<DrivingTime> {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${start}&destinations=${end}&key=${GOOGLE_API_KEY}`;
    if (driveDataCache[`${start}-${end}`]) {
        return driveDataCache[`${start}-${end}`];
    }
    const response = await CapacitorHttp.get({ url });
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
        const response = await CapacitorHttp.get({ url });

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
        const response = await CapacitorHttp.get({ url });
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
    personACoords: Coordinates,
    personBCoords: Coordinates,
    flexibility: number
): Promise<City[]> {
    const midpoint = await findMidpoint(personACoords, personBCoords);
    const cities = getCitiesByRadius(
        personACoords,
        personBCoords,
        midpoint,
        flexibility
    );

    return cities;
}

const Results: React.FC = () => {
    const location = useLocation();
    const { personA, personB } = (location.state as ResultsProps) || null;

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
                if (personA.coordinates && personB.coordinates) {
                    setIndex(0);
                    setIsLoading(true);
                    const personACoords = personA.coordinates;
                    const personBCoords = personB.coordinates;
                    setpersonACoords(personACoords);
                    setpersonBCoords(personBCoords);

                    const cachedDataForCurrentFlexibility = cachedCities.find(
                        (cachedCity) =>
                            cachedCity.flexibility === flexibility &&
                            cachedCity.personA ===
                                `${personA.address} ${personA.zipCode}` &&
                            cachedCity.personB ===
                                `${personB.address} ${personB.zipCode}`
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
                                    address: location.address,
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
                                personA: `${personA.address} ${personA.zipCode}`,
                                personB: `${personB.address} ${personB.zipCode}`,
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
    }, [personA, personB, flexibility]);

    const findAnother = (index: number) => {
        const nextIndex = (index + 1) % middleCityList.length; // Calculate the next index cyclically
        setIndex(nextIndex);
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonIcon icon={home} size="large" />
                    </IonButtons>
                    <div className="ion-text-center">
                        <IonText>
                            {middleCityList[index]?.address.city},{" "}
                        </IonText>
                        <IonText color={"primary"}>
                            {middleCityList[index]?.address.stateCode}
                        </IonText>
                    </div>
                    <IonButtons slot="end">
                        <IonIcon icon={newspaper} size="large" />
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
                                        {/* <Map
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
                                        /> */}
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
