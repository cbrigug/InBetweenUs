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
    IonModal,
    IonLabel,
    IonChip,
    IonRow,
} from "@ionic/react";
import { arrowBack, close, filter, newspaper } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import ThingsToDoItem from "../../../components/Results/ThingsToDo/ThingsToDoItem";
import { ShortCoords } from "../../../interfaces/City";
import { CapacitorHttp } from "@capacitor/core";
import { environment } from "../../../../environment.dev";
import { capitalize } from "../../../utils/stringUtils";
import ActivityTypeIcon from "../../../components/Results/ThingsToDo/ActivityTypeIcon";
import { createUseStyles } from "react-jss";
import FilterModalContent from "../../../components/Results/ThingsToDo/FilterModalContent";

interface ThingsToDoProps {
    coords: ShortCoords;
}

const OPENTRIPMAP_API_KEY = environment.REACT_APP_OPENTRIPMAP_API_KEY;
const RADIUS = 24140; // radius in meters (15 miles)
const ITEMS_PER_PAGE = 10;

const useStyles = createUseStyles({
    chipIcon: {
        color: "black",
    },
});

const ThingsToDoPage: React.FC = () => {
    const classes = useStyles();

    const location = useLocation();
    const modal = useRef<HTMLIonModalElement>(null);

    const addToItinerary = (activity: string) => {
        console.log(activity);
    };

    // full list of things to do, should not change
    const [allThingsToDo, setAllThingsToDo] = useState([]);

    // potentially filtered list of all things to do, should change
    const [filteredThingsToDo, setFilteredThingsToDo] = useState<any[]>([]);

    // list of things to do to display that the user sees
    const [thingsToDo, setThingsToDo] = useState<any[]>([]);
    const [coords, setCoords] = useState<ShortCoords>(
        (location.state as ThingsToDoProps)?.coords ?? {}
    );

    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    useEffect(() => {
        setActiveFilters([]);

        const fetchPlaces = async () => {
            const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${RADIUS}&lon=${coords.lng}&lat=${coords.lat}&rate=3&limit=30&apikey=${OPENTRIPMAP_API_KEY}`;

            const response = await CapacitorHttp.get({ url });

            return response.data.features.map(
                (feature: any) => feature.properties
            );
        };

        fetchPlaces().then((places) => {
            setAllThingsToDo(places);
            setFilteredThingsToDo(places);
            setThingsToDo(places.slice(0, ITEMS_PER_PAGE));
        });
    }, [coords]);

    const handleInfiniteScroll = () => {
        // new items to display
        const newThingsToDo = filteredThingsToDo.slice(
            0,
            thingsToDo.length + ITEMS_PER_PAGE
        );

        setThingsToDo(newThingsToDo);
    };

    useEffect(() => {
        let filteredThingsToDo = [...allThingsToDo];

        if (search && activeFilters.length > 0) {
            const curThingsToDo = filteredThingsToDo.filter(
                (thingToDo: any) =>
                    (thingToDo.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                        thingToDo.kinds.includes(search.toLowerCase())) &&
                    activeFilters.some((filter) =>
                        thingToDo.kinds.includes(filter)
                    )
            );
            filteredThingsToDo = curThingsToDo;
        } else if (search) {
            const curThingsToDo = filteredThingsToDo.filter(
                (thingToDo: any) =>
                    thingToDo.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    thingToDo.kinds.includes(search.toLowerCase())
            );
            filteredThingsToDo = curThingsToDo;
        } else if (activeFilters.length > 0) {
            const curThingsToDo = filteredThingsToDo.filter((thingToDo: any) =>
                activeFilters.some((filter) => thingToDo.kinds.includes(filter))
            );
            filteredThingsToDo = curThingsToDo;
        }

        setFilteredThingsToDo(filteredThingsToDo);
        setThingsToDo(filteredThingsToDo);
    }, [search, activeFilters]);

    const removeChip = (activityType: string) => {
        const curFilters = activeFilters.filter(
            (filter) => filter !== activityType
        );
        setActiveFilters(curFilters);
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
                        onIonInput={(e) => setSearch(e.target.value ?? "")}
                    />
                    <IonIcon
                        icon={filter}
                        slot="end"
                        id="open-modal"
                        className="ion-no-margin"
                    />
                </IonItem>
                <IonList>
                    {activeFilters.map((filter) => (
                        <IonChip
                            key={filter}
                            color="primary"
                            onClick={() => removeChip(filter)}
                        >
                            <ActivityTypeIcon
                                types={filter}
                                color="dark"
                                className={classes.chipIcon}
                            />
                            <IonLabel color="dark">
                                &nbsp;{capitalize(filter)}
                            </IonLabel>
                            <IonIcon icon={close} />
                        </IonChip>
                    ))}
                </IonList>
                {thingsToDo.length > 0 ? (
                    <IonList>
                        {thingsToDo.map((thingToDo: any) => (
                            <ThingsToDoItem
                                key={thingToDo.xid}
                                thingToDo={thingToDo}
                                addToItinerary={addToItinerary}
                            />
                        ))}
                    </IonList>
                ) : (
                    <IonRow className="ion-justify-content-center">
                        <IonText color="secondary">No results found</IonText>
                    </IonRow>
                )}
                <IonInfiniteScroll
                    onIonInfinite={(e) => {
                        handleInfiniteScroll();
                        setTimeout(() => e.target.complete(), 500);
                    }}
                    disabled={thingsToDo.length === filteredThingsToDo.length}
                >
                    <IonInfiniteScrollContent />
                </IonInfiniteScroll>
                <IonModal
                    ref={modal}
                    trigger="open-modal"
                    initialBreakpoint={0.85}
                    breakpoints={[0.95, 0.85, 0]}
                >
                    <FilterModalContent
                        setActiveFilters={setActiveFilters}
                        activeFilters={activeFilters}
                    />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default ThingsToDoPage;
