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
    carOutline,
    chevronExpandOutline,
    helpCircleOutline,
    locationOutline,
    refreshOutline,
    timeOutline,
} from "ionicons/icons";
import axios, { all } from "axios";
import GoogleMapsLink from "./GoogleMapsLink";
import { convertSecondsToHoursMinutes } from "../utils/timeUtils";

interface ResultsProps {
    person1Zip: string;
    person2Zip: string;
}

interface Coordinates {
    longitude: number;
    latitude: number;
}

const apiKey = "";

const zipToCoords = async (zip: string) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { longitude: lng, latitude: lat };
        } else {
            throw new Error("No coordinates found for the given zip code.");
        }
    } catch (error) {
        console.error("Error converting zip code to coordinates:", error);
        throw error;
    }
};

const findCity = async (coords: Coordinates) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${apiKey}`
        );
        const data = await response.json();

        if (
            data.status === "OK" &&
            data.results.length > 0 &&
            data.results[0].address_components.length > 1
        ) {
            const city = data.results[0].formatted_address;
            return city;
        } else {
            throw new Error("No city found for the given coordinates.");
        }
    } catch (error) {
        console.error("Error finding middle city:", error);
        return "";
    }
};

interface DistanceMatrixResponse {
    rows: {
        elements: {
            duration: {
                value: number;
            };
        }[];
    }[];
}

async function getDrivingTime(start: string, end: string): Promise<number> {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${start}&destinations=${end}&key=${apiKey}`;
    const response = await axios.get<DistanceMatrixResponse>(url);
    const drivingTime = response.data.rows[0].elements[0].duration?.value;
    return drivingTime;
}

const drivingTimeCache = new Map<string, number>();

async function getCachedDrivingTime(
    start: string,
    end: string
): Promise<number> {
    const cacheKey = `${start}-${end}`;

    if (drivingTimeCache.has(cacheKey)) {
        return drivingTimeCache.get(cacheKey)!;
    }

    const drivingTime = await getDrivingTime(start, end);
    drivingTimeCache.set(cacheKey, drivingTime);

    return drivingTime;
}

interface MidpointData {
    address: string;
    midpoint: Coordinates;
    drivingTimeA: number;
    drivingTimeB: number;
    algo: number;
}

async function findMidpoint(
    personALat: number,
    personALng: number,
    personBLat: number,
    personBLng: number,
    flexibility: number
): Promise<MidpointData[]> {
    const lyst: MidpointData[] = [];
    const latRange = [personALat + flexibility, personBLat];
    const lngRange = [personALng, personBLng - flexibility];

    const numDivisions = 10;
    const latIncrement = (latRange[1] - latRange[0]) / numDivisions;
    const lngIncrement = (lngRange[1] - lngRange[0]) / numDivisions;

    let minDifference = Infinity;
    let midpointLat = 0;
    let midpointLng = 0;

    const drivingTimePromises = [];

    for (let i = 0; i <= numDivisions; i++) {
        const lat = latRange[0] + i * latIncrement;

        for (let j = 0; j <= numDivisions; j++) {
            const lng = lngRange[0] + j * lngIncrement;

            drivingTimePromises.push(
                getCachedDrivingTime(
                    `${lat},${lng}`,
                    `${personALat},${personALng}`
                )
            );
            drivingTimePromises.push(
                getCachedDrivingTime(
                    `${lat},${lng}`,
                    `${personBLat},${personBLng}`
                )
            );
        }
    }

    const drivingTimes = await Promise.all(drivingTimePromises);

    let drivingTimesIndex = 0;

    for (let i = 0; i <= numDivisions; i++) {
        const lat = latRange[0] + i * latIncrement;

        for (let j = 0; j <= numDivisions; j++) {
            const lng = lngRange[0] + j * lngIncrement;

            const drivingTimeA = drivingTimes[drivingTimesIndex];
            const drivingTimeB = drivingTimes[drivingTimesIndex + 1];
            drivingTimesIndex += 2;

            const difference = Math.abs(drivingTimeA - drivingTimeB);

            if (difference > 2700) {
                continue;
            }

            const averageDrivingTime = (drivingTimeA + drivingTimeB) / 2;

            if (difference < minDifference) {
                minDifference = difference;
                midpointLat = lat;
                midpointLng = lng;
                lyst.push({
                    address: "",
                    midpoint: { latitude: lat, longitude: lng },
                    drivingTimeA,
                    drivingTimeB,
                    algo: 0.5 * difference + 0.5 * averageDrivingTime,
                });
            }
        }
    }

    const sortedLyst = lyst.sort((a, b) => a.algo - b.algo);
    return sortedLyst;
}

const Results: React.FC = () => {
    const location = useLocation();
    const { person1Zip, person2Zip } = (location.state as ResultsProps) || {};

    const [middleCityList, setMiddleCityList] = useState<any[]>([]);
    const [index, setIndex] = useState(0);
    const [middleCity, setMiddleCity] = useState("");

    const [person1Coords, setPerson1Coords] = useState<Coordinates>();
    const [person2Coords, setPerson2Coords] = useState<Coordinates>();

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

    useEffect(() => {
        const fetchCoords = async () => {
            try {
                setIsLoading(true);
                if (person1Zip && person2Zip) {
                    const person1Coords = await zipToCoords(person1Zip);
                    const person2Coords = await zipToCoords(person2Zip);
                    setPerson1Coords(person1Coords);
                    setPerson2Coords(person2Coords);

                    findMidpoint(
                        person1Coords.latitude,
                        person1Coords.longitude,
                        person2Coords.latitude,
                        person2Coords.longitude,
                        flexibility
                    ).then(async (lyst: MidpointData[]) => {
                        // populate address field of midpoint data
                        const allCities = await Promise.all(
                            lyst.map(async (item) => {
                                const city = await findCity(item.midpoint);
                                item.address = city;
                                return item;
                            })
                        );

                        setMiddleCityList(allCities);

                        if (allCities.length > 0) {
                            setMiddleCity(allCities[0].address);
                        } else {
                            presentToast("bottom");
                        }
                        setIsLoading(false);
                    });
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchCoords();
    }, [person1Zip, person2Zip, flexibility]);

    const findAnother = (index: number) => {
        const nextIndex = (index + 1) % middleCityList.length; // Calculate the next index cyclically
        setIndex(nextIndex);
        setMiddleCity(middleCityList[index].address);
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
                    {middleCity ? (
                        <>
                            <IonGrid>
                                <IonRow>
                                    <IonCol>
                                        <GoogleMapsLink
                                            formattedAddress={
                                                middleCityList[index]?.address
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
                                                    ?.drivingTimeA
                                            )}
                                        </IonText>
                                    </IonCol>
                                    <IonCol>
                                        <IonText color="medium">
                                            Person B:{" "}
                                            {convertSecondsToHoursMinutes(
                                                middleCityList[index]
                                                    ?.drivingTimeB
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
                            </IonGrid>
                        </>
                    ) : (
                        <div className="no-results ion-text-center ion-justify-content-center ion-align-items-center">
                            <IonText id="no-results">No Results Found</IonText>
                            <br />
                            <IonText color="medium">
                                Sorry, we couldn't find any results based on
                                your search.
                            </IonText>
                        </div>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Results;
