import { GoogleMap } from "@capacitor/google-maps";

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
import GoogleMapsLink from "../components/GoogleMapsLink";
import { convertSecondsToHoursMinutes } from "../utils/timeUtils";
import { environment } from "../../environment.dev";
import Map from "../components/Map";

interface ResultsProps {
    person1Zip: string;
    person2Zip: string;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

const API_KEY = environment.REACT_APP_GOOGLE_API_KEY;

const zipToCoords = async (zip: string) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${API_KEY}`
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
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${API_KEY}`
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
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${start}&destinations=${end}&key=${API_KEY}`;
    const response = await axios.get<DistanceMatrixResponse>(url);
    const drivingTime = response.data.rows[0].elements[0].duration?.value;
    const distance = response.data.rows[0].elements[0].distance?.value;
    return { time: drivingTime, distance: distance };
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
    personBLng: number
) {
    try {
        // Define the starting and destination locations as coordinates
        const startLocation = { lat: personALat, lng: personALng };
        const destinationLocation = { lat: personBLat, lng: personBLng };

        // Define the departure time as next day at 4:00 AM UTC (optimal conditions)
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setUTCHours(4, 0, 0, 0);
        const departureTime = Math.floor(currentDate.getTime() / 1000);

        // Construct the URL for the Directions API request
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.lat},${startLocation.lng}&destination=${destinationLocation.lat},${destinationLocation.lng}&mode=driving&departure_time=${departureTime}&traffic_model=optimistic&key=${API_KEY}`;

        // Make the API request using axios
        const response = await axios.get(url);
        const route = response.data.routes[0];
        let accumulatedDistance = 0;
        let furthestCoordinates: Coordinates = { latitude: 0, longitude: 0 };
        const totalDriveTime = (
            await getDriveData(
                `${personALat},${personALng}`,
                `${personBLat},${personBLng}`
            )
        ).time;

        const middleDistanceMeters = route.legs[0].distance.value / 2;

        // Iterate through the route's steps
        for (const step of route.legs[0].steps) {
            const stepDistance = step.distance.value || 0;
            accumulatedDistance += stepDistance;

            // If accumulated distance exceeds the maximum distance, break the loop
            if (accumulatedDistance > middleDistanceMeters) {
                // Calculate the proportion of the step to the maximum distance
                const proportion =
                    (middleDistanceMeters -
                        (accumulatedDistance - stepDistance)) /
                    stepDistance;

                // Calculate the coordinates at the specified proportion of the step
                const lat =
                    step.start_location.lat +
                    proportion *
                        (step.end_location.lat - step.start_location.lat);
                const lng =
                    step.start_location.lng +
                    proportion *
                        (step.end_location.lng - step.start_location.lng);

                furthestCoordinates = { latitude: lat, longitude: lng };

                // fine tune midpoint to find most centralized location
                // const personADriveTime = (
                //     await getDriveData(
                //         `${personALat},${personALng}`,
                //         `${lat},${lng}`
                //     )
                // ).time;

                // traverse the route until the time is within 2 minutes of half the total drive time
                // while (Math.abs(personADriveTime - totalDriveTime / 2) > 120) {
                //     const newLat =
                //         furthestCoordinates.latitude +
                //         (personALat - furthestCoordinates.latitude) / 100;
                //     const newLng =
                //         furthestCoordinates.longitude +
                //         (personALng - furthestCoordinates.longitude) / 100;

                // // if person A's drive time is greater than person B's, move the midpoint closer to person A
                // if (personADriveTime.time > personBDriveTime.time) {
                //     // move midpoint closer to person A
                //     for (let i = 0; i < 5; i++) {
                //         const newLat =
                //             furthestCoordinates.latitude +
                //             (personALat - furthestCoordinates.latitude) / 100;
                //         const newLng =
                //             furthestCoordinates.longitude +
                //             (personALng - furthestCoordinates.longitude) / 100;

                //         furthestCoordinates = {
                //             latitude: newLat,
                //             longitude: newLng,
                //         };

                //         const newPersonADriveTime = await getDriveData(
                //             `${personALat},${personALng}`,
                //             `${newLat},${newLng}`
                //         );
                //         const newPersonBDriveTime = await getDriveData(
                //             `${personBLat},${personBLng}`,
                //             `${newLat},${newLng}`
                //         );
                //         const difference = Math.abs(
                //             newPersonADriveTime.time - newPersonBDriveTime.time
                //         )
                //         console.log(convertSecondsToHoursMinutes(difference));
                //     }
                // } else {
                //     // move midpoint closer to person B
                //     for (let i = 0; i < 5; i++) {
                //         const newLat =
                //             furthestCoordinates.latitude +
                //             (personBLat - furthestCoordinates.latitude) / 100;
                //         const newLng =
                //             furthestCoordinates.longitude +
                //             (personBLng - furthestCoordinates.longitude) / 100;

                //         furthestCoordinates = {
                //             latitude: newLat,
                //             longitude: newLng,
                //         };

                //         const newPersonADriveTime = await getDriveData(
                //             `${personALat},${personALng}`,
                //             `${newLat},${newLng}`
                //         );
                //         const newPersonBDriveTime = await getDriveData(
                //             `${personBLat},${personBLng}`,
                //             `${newLat},${newLng}`
                //         );
                //         const difference = Math.abs(
                //             newPersonADriveTime.time - newPersonBDriveTime.time
                //         )
                //         console.log(convertSecondsToHoursMinutes(difference));
                //     }
                // }

                break;
            }
        }

        return [furthestCoordinates];
    } catch (error) {
        console.error("Error fetching directions:", error);
        throw error;
    }
}

async function findLocationsToMeet(
    personALat: number,
    personALng: number,
    personBLat: number,
    personBLng: number
): Promise<Coordinates[]> {
    const midpoint = await findMidpoint(
        personALat,
        personALng,
        personBLat,
        personBLng
    );

    return midpoint;
}

const Results: React.FC = () => {
    const location = useLocation();
    const { person1Zip, person2Zip } = (location.state as ResultsProps) || {};

    const [middleCityList, setMiddleCityList] = useState<any[]>([]);
    const [index, setIndex] = useState(0);
    const [middleCity, setMiddleCity] = useState("");

    const [midpoint, setMidpoint] = useState<Coordinates>({
        latitude: 0,
        longitude: 0,
    });
    const [person1Coords, setPerson1Coords] = useState<Coordinates>({
        latitude: 0,
        longitude: 0,
    });
    const [person2Coords, setPerson2Coords] = useState<Coordinates>({
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

    useEffect(() => {
        const fetchCoords = async () => {
            try {
                setIsLoading(true);
                if (person1Zip && person2Zip) {
                    const person1Coords = await zipToCoords(person1Zip);
                    const person2Coords = await zipToCoords(person2Zip);
                    setPerson1Coords(person1Coords);
                    setPerson2Coords(person2Coords);

                    findLocationsToMeet(
                        person1Coords.latitude,
                        person1Coords.longitude,
                        person2Coords.latitude,
                        person2Coords.longitude
                        // flexibility
                    ).then(async (lyst: Coordinates[]) => {
                        setMidpoint(lyst[0]);
                        const personAStart = `${person1Coords.latitude},${person1Coords.longitude}`;
                        const personBStart = `${person2Coords.latitude},${person2Coords.longitude}`;
                        const end = `${lyst[0].latitude},${lyst[0].longitude}`;
                        // populate address field of midpoint data
                        const allCities = await Promise.all(
                            lyst.map(async (item) => {
                                return {
                                    ...item,
                                    address: await findCity(item),
                                    drivingTimeA: (
                                        await getDriveData(personAStart, end)
                                    ).time,
                                    drivingTimeB: (
                                        await getDriveData(personBStart, end)
                                    ).time,
                                };
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
                                <IonRow>
                                    <IonCol>
                                        <Map
                                            center={midpoint}
                                            personA={person1Coords}
                                            personB={person2Coords}
                                        />
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
