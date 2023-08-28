import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
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

interface ResultsProps {
    person1Zip: string;
    person2Zip: string;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

const GOOGLE_API_KEY = environment.REACT_APP_GOOGLE_API_KEY;
const HERE_API_KEY = environment.REACT_APP_HERE_API_KEY;

interface CachedCityData {
    flexibility: number;
    person1Zip: string;
    person2Zip: string;
    cities: any[]; // Update the type to match your city data structure
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

interface MidpointData {
    address: string;
    midpoint: Coordinates;
    drivingTimeA: number;
    drivingTimeB: number;
    algo: number;
}

async function findMidpoint(personA: Coordinates, personB: Coordinates) {
    try {
        // Define the starting and destination locations as coordinates
        const startLocation = personA;
        const destinationLocation = personB;

        // Define the departure time as next day at 4:00 AM UTC (optimal conditions)
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setUTCHours(4, 0, 0, 0);
        const departureTime = Math.floor(currentDate.getTime() / 1000);

        // Construct the URL for the Directions API request
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.latitude},${startLocation.longitude}&destination=${destinationLocation.latitude},${destinationLocation.longitude}&mode=driving&departure_time=${departureTime}&traffic_model=optimistic&key=${GOOGLE_API_KEY}`;

        // Make the API request using axios
        const response = await axios.get(url);
        const route = response.data.routes[0];
        let accumulatedDistance = 0;
        let furthestCoordinates: Coordinates = { latitude: 0, longitude: 0 };

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
                break;
            }
        }

        return furthestCoordinates;
    } catch (error) {
        console.error("Error fetching directions:", error);
        throw error;
    }
}

interface ShiftedCoordinates {
    halfOne: Coordinates;
    halfTwo: Coordinates;
}

function calcPerpendicularSlope(personA: Coordinates, personB: Coordinates) {
    const slope =
        (personB.longitude - personA.longitude) /
        (personB.latitude - personA.latitude);
    return -1 / slope;
}

function addDistanceToCenterCoords(
    personA: Coordinates,
    personB: Coordinates,
    center: Coordinates,
    radius: number,
    flexibility: number
): ShiftedCoordinates {
    const diameter = radius * 2 * flexibility;
    // angle should be the slope of the perpendicular line that connects personA and personB
    // we add pi to get the other side of the line
    let angle = Math.atan(calcPerpendicularSlope(personA, personB));

    // calculate the coordinates of a line that is pointed in the direction of angle, traversing it n meters
    // we want to search a new area so we go the full diameter of the search area
    const halfOneShiftedX =
        center.longitude + (diameter / 111111) * Math.cos(angle);
    const halfOneShiftedY =
        center.latitude + (diameter / 111111) * Math.sin(angle);

    const halfTwoShiftedX =
        center.longitude + (diameter / 111111) * Math.cos(angle + Math.PI);
    const halfTwoShiftedY =
        center.latitude + (diameter / 111111) * Math.sin(angle + Math.PI);

    const halfOne: Coordinates = {
        latitude: halfOneShiftedY,
        longitude: halfOneShiftedX,
    };
    const halfTwo: Coordinates = {
        latitude: halfTwoShiftedY,
        longitude: halfTwoShiftedX,
    };

    return { halfOne, halfTwo };
}

async function getCitiesByRadius(
    personA: Coordinates,
    personB: Coordinates,
    center: Coordinates,
    flexibility: number
) {
    const radius = 24140; // radius in meters (15 miles)
    const latitude = center.latitude;
    const longitude = center.longitude;

    if (flexibility === 0) {
        const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?in=circle:${latitude},${longitude};r=${radius}&types=city&limit=25&apiKey=${HERE_API_KEY}`;
        const response = await axios.get(url);

        return response.data.items.filter((item: any, index: number) => {
            return index % 4 === 0;
        });
    }

    let cities = [];
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
        // push every third city
        cities.push(
            ...response.data.items.filter((item: any, index: number) => {
                return index % 10 === 0;
            })
        );
    }

    // sort by distance
    return cities.sort((a: any, b: any) => {
        const distanceA = a.distance;
        const distanceB = b.distance;
        return distanceA - distanceB;
    });
}

interface ShortCoords {
    lat: number;
    lng: number;
}

interface LocationData {
    title: string;
    position: ShortCoords;
    address: string;
    drivingTimeA: number;
    drivingTimeB: number;
}

async function findLocationsToMeet(
    personA: Coordinates,
    personB: Coordinates,
    flexibility: number
): Promise<LocationData[]> {
    const midpoint = await findMidpoint(personA, personB);
    const cities = getCitiesByRadius(personA, personB, midpoint, flexibility);

    return cities;
}

const Results: React.FC = () => {
    const location = useLocation();
    const { person1Zip, person2Zip } = (location.state as ResultsProps) || {};

    const [middleCityList, setMiddleCityList] = useState<any[]>([]);
    const [index, setIndex] = useState(0);
    const [middleCity, setMiddleCity] = useState("");

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
    const [cachedCities, setCachedCities] = useState<CachedCityData[]>([]);

    useEffect(() => {
        const fetchCoords = async () => {
            try {
                setIsLoading(true);
                if (person1Zip && person2Zip) {
                    const person1Coords = await zipToCoords(person1Zip);
                    const person2Coords = await zipToCoords(person2Zip);
                    setPerson1Coords(person1Coords);
                    setPerson2Coords(person2Coords);

                    const cachedDataForCurrentFlexibility = cachedCities.find(
                        (cachedCity) => cachedCity.flexibility === flexibility
                    );

                    if (cachedDataForCurrentFlexibility) {
                        setMiddleCityList(
                            cachedDataForCurrentFlexibility.cities
                        );
                        setMiddleCity(
                            cachedDataForCurrentFlexibility.cities[0].address
                        );
                        setIsLoading(false);
                    } else {
                        const locations = await findLocationsToMeet(
                            person1Coords,
                            person2Coords,
                            flexibility
                        );

                        const personAStart = `${person1Coords.latitude},${person1Coords.longitude}`;
                        const personBStart = `${person2Coords.latitude},${person2Coords.longitude}`;
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
                            setMiddleCity(allCities[0].address);
                            const newCachedCityData = {
                                flexibility,
                                person1Zip,
                                person2Zip,
                                cities: allCities,
                            };
                            setCachedCities([
                                ...cachedCities,
                                newCachedCityData,
                            ]);
                            localStorage.setItem(
                                `${person1Zip}-${person2Zip}`,
                                JSON.stringify(newCachedCityData)
                            );
                        } else {
                            presentToast("bottom");
                        }
                        setIsLoading(false);
                    }
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
                                            center={{
                                                latitude:
                                                    middleCityList[index]
                                                        .position.lat,
                                                longitude:
                                                    middleCityList[index]
                                                        .position.lng,
                                            }}
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
