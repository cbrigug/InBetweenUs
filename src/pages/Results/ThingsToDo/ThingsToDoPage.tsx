import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonText,
    IonContent,
    IonButton,
    IonSearchbar,
    IonList,
    IonItem,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
} from "@ionic/react";
import { arrowBack, filter, newspaper } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ThingsToDoItem from "../../../components/Results/ThingsToDo/ThingsToDoItem";
import { ShortCoords } from "../../../interfaces/City";
import { CapacitorHttp } from "@capacitor/core";
import { environment } from "../../../../environment.dev";

interface ThingsToDoProps {
    coords: ShortCoords;
}

const OPENTRIPMAP_API_KEY = environment.REACT_APP_OPENTRIPMAP_API_KEY;
const RADIUS = 24140; // radius in meters (15 miles)
const ITEMS_PER_PAGE = 10;

const ThingsToDoPage: React.FC = () => {
    const location = useLocation();

    const addToItinerary = (activity: string) => {
        console.log(activity);
    };

    const [allThingsToDo, setAllThingsToDo] = useState([]);
    const [thingsToDo, setThingsToDo] = useState([]);
    const [coords, setCoords] = useState<ShortCoords>(
        (location.state as ThingsToDoProps)?.coords ?? {}
    );

    useEffect(() => {
        const fetchPlaces = async () => {
            const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${RADIUS}&lon=${coords.lng}&lat=${coords.lat}&rate=3&limit=30&apikey=${OPENTRIPMAP_API_KEY}`;
            const response = await CapacitorHttp.get({ url });

            return response.data.features.map(
                (feature: any) => feature.properties
            );
        };

        fetchPlaces().then((places) => {
            setAllThingsToDo(places);
            setThingsToDo(places.slice(0, ITEMS_PER_PAGE));
        });
    }, [coords]);

    const handleInfiniteScroll = () => {
        const newThingsToDo = allThingsToDo.slice(
            thingsToDo.length,
            thingsToDo.length + ITEMS_PER_PAGE
        );
        setThingsToDo([...thingsToDo, ...newThingsToDo]);
    };

    const handleSearch = (term: string) => {
        const filteredThingsToDo = allThingsToDo.filter((thingToDo: any) =>
            thingToDo.name.toLowerCase().includes(term.toLowerCase()) ||
            thingToDo.kinds.includes(term.toLowerCase())
        );
        setThingsToDo(filteredThingsToDo);
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink="/results" routerDirection="none">
                            <IonIcon
                                slot="icon-only"
                                icon={arrowBack}
                                color="dark"
                            />
                        </IonButton>
                    </IonButtons>
                    <div className="ion-text-center">
                        <IonText>Things to&nbsp;</IonText>
                        <IonText color={"primary"}>do</IonText>
                    </div>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon
                                slot="icon-only"
                                icon={newspaper}
                                color="dark"
                            />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding-horizontal">
                <IonItem lines="none" className="ion-no-padding">
                    <IonSearchbar
                        className="ion-no-margin"
                        debounce={500}
                        onIonInput={(e) => handleSearch(e.target.value ?? "")}
                    />
                </IonItem>
                <IonList>
                    {thingsToDo?.map((thingToDo: any) => (
                        <ThingsToDoItem
                            key={thingToDo.xid}
                            thingToDo={thingToDo}
                            addToItinerary={addToItinerary}
                        />
                    ))}
                </IonList>
                <IonInfiniteScroll
                    onIonInfinite={(e) => {
                        handleInfiniteScroll();
                        setTimeout(() => e.target.complete(), 500);
                    }}
                >
                    <IonInfiniteScrollContent />
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
};

export default ThingsToDoPage;
