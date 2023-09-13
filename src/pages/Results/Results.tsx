import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonLoading,
    IonPage,
    IonText,
    IonToolbar,
    useIonToast,
} from "@ionic/react";
import "./Results.css";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { home, newspaper } from "ionicons/icons";
import { environment } from "../../../environment.dev";
import React from "react";
import NoResultsFound from "./NoResultsFound";
import { findMidpoint } from "../../utils/midpointUtils";
import {
    Coordinates,
    addDistanceToCenterCoords,
} from "../../utils/distanceUtils";
import { City, CityResponse } from "../../interfaces/City";
import { CapacitorHttp } from "@capacitor/core";
import { FormDataType } from "../../components/Home/PersonCard/PersonModal";
import DrivingTimeBanner from "../../components/Results/DrivingTimeBanner";
import ThingsToDoSection from "../../components/Results/ThingsToDo/ThingsToDoSection";
import NearbyCitiesSection from "../../components/Results/NearbyCities/NearbyCitiesSection";
import Itinerary from "../../components/Itinerary/Itinerary";
import PlacesToStaySection from "../../components/Results/PlacesToStay/PlacesToStaySection";

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

const mockPersonA = {
    name: "Coleman Briguglio",
    address: "410 E 4th Ave",
    city: "Lititz",
    state: "PA",
    zipCode: "17543",
    country: "US",
    photo: null,
    coordinates: {
        latitude: 40.1495276,
        longitude: -76.2973725,
    },
};

const mockPersonB = {
    name: "Fafa Havi",
    address: "1200 Park Rd",
    city: "Harrisonburg",
    state: "VA",
    zipCode: "22802",
    country: "US",
    photo: null,
    coordinates: {
        latitude: 38.4720566,
        longitude: -78.8787092,
    },
};

const Results: React.FC = () => {
    const location = useLocation();
    // const [personA, setPersonA] = useState<FormDataType>(
    //     (location.state as ResultsProps)?.personA
    // );
    // const [personB, setPersonB] = useState<FormDataType>(
    //     (location.state as ResultsProps)?.personB
    // );

    const [personA, setPersonA] = useState<FormDataType>(mockPersonA);
    const [personB, setPersonB] = useState<FormDataType>(mockPersonB);

    const [curCity, setCurCity] = useState<City>({} as City);
    const [middleCityList, setMiddleCityList] = useState<City[]>([]);

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

    // Itinerary Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const [cachedCities, setCachedCities] = useState<CachedCityData[]>([]);

    useEffect(() => {
        const fetchCoords = async () => {
            if (!personA || !personB) {
                return;
            }

            try {
                if (personA.coordinates && personB.coordinates) {
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
                        if (middleCityList.length === 0) {
                            setCurCity(
                                cachedDataForCurrentFlexibility.cities[0]
                            );
                        }
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

                        if (middleCityList.length === 0) {
                            setCurCity(allCities[0]);
                        }
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

    // clear storage caches on change of personA or personB or curCity
    useEffect(() => {
        // clear hotel cache
        localStorage.removeItem("hotels");
        localStorage.removeItem("thingsToDo");
    }, [personA, personB, curCity]);

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink="/home" routerDirection="root">
                            <IonIcon
                                slot="icon-only"
                                icon={home}
                                size="large"
                                color="dark"
                            />
                        </IonButton>
                    </IonButtons>
                    <div className="ion-text-center">
                        <IonText>{curCity?.address?.city},&nbsp;</IonText>
                        <IonText color={"primary"}>
                            {curCity?.address?.stateCode}
                        </IonText>
                    </div>
                    <IonButtons slot="end">
                        <IonButton onClick={toggleModal}>
                            <IonIcon
                                slot="icon-only"
                                icon={newspaper}
                                size="large"
                                color="dark"
                            />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding-horizontal">
                {curCity ? (
                    <>
                        <DrivingTimeBanner
                            personA={personA}
                            personB={personB}
                            drivingTimeA={curCity?.drivingTimeA}
                            drivingTimeB={curCity?.drivingTimeB}
                        />

                        <ThingsToDoSection
                            cityName={curCity?.title}
                            coords={curCity?.position}
                        />

                        <PlacesToStaySection coords={curCity?.position} />

                        <NearbyCitiesSection
                            personA={personA}
                            personB={personB}
                            cities={middleCityList.filter(
                                (city) => city.id != curCity.id
                            )}
                            setFlexibility={setFlexibility}
                            setCurrentCity={setCurCity}
                        />
                    </>
                ) : (
                    <NoResultsFound />
                )}
                <IonLoading isOpen={isLoading} />
                <Itinerary
                    cityName={curCity.title}
                    isOpen={isModalOpen}
                    toggleModal={toggleModal}
                />
            </IonContent>
        </IonPage>
    );
};

export default React.memo(Results);
