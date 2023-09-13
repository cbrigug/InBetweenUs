import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonText,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonRow,
    IonGrid,
    IonBadge,
} from "@ionic/react";
import { arrowBack, person } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { ShortCoords } from "../../../interfaces/City";
import { environment } from "../../../../environment.dev";
import { CapacitorHttp } from "@capacitor/core";
import { toTitleCase } from "../../../utils/stringUtils";
import { createUseStyles } from "react-jss";

interface OtherStaysPageProps {
    coords: ShortCoords;
}

const OPENTRIPMAP_API_KEY = environment.REACT_APP_OPENTRIPMAP_API_KEY;
const RADIUS = 24140; // radius in meters (15 miles)

const useStyles = createUseStyles({
    text: {
        fontSize: "1rem",
    },
    popularityRow: {
        marginTop: "calc(var(--ion-margin, 16px) * 0.5)",
    },
});

const OtherStaysPage: React.FC = () => {
    const classes = useStyles();
    const location = useLocation();

    const [coords, setCoords] = useState<ShortCoords>(
        (location.state as OtherStaysPageProps)?.coords ?? {}
    );

    const [otherPlacesToStay, setOtherPlacesToStay] = useState([]);

    useEffect(() => {
        const cachedOtherPlacesToStay = localStorage.getItem("otherPlacesToStay");

        if (cachedOtherPlacesToStay) {
            setOtherPlacesToStay(JSON.parse(cachedOtherPlacesToStay));
        } else {
            const fetchPlaces = async () => {
                const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${RADIUS}&lon=${coords.lng}&lat=${coords.lat}&kinds=accomodations&limit=10&apikey=${OPENTRIPMAP_API_KEY}`;

                const response = await CapacitorHttp.get({ url });

                const places = response.data.features.map(
                    (feature: any) => feature.properties
                );

                // Cache the fetched data in localStorage
                localStorage.setItem("otherPlacesToStay", JSON.stringify(places));

                return places;
            };

            fetchPlaces().then((places) => {
                setOtherPlacesToStay(places);
            });
        }
    }, [coords]);

    const openInGoogle = (hotelName: string) => {
        const url = `https://www.google.com/search?q=${hotelName}`;

        window.open(url, "_blank");
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
                    <IonTitle>
                        <IonText>Other&nbsp;</IonText>
                        <IonText color="primary">Stays</IonText>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    {otherPlacesToStay.map((hotel: any) => (
                        <IonItem
                            key={hotel.xid}
                            button
                            onClick={() => openInGoogle(hotel.name)}
                        >
                            <IonGrid>
                                <IonRow>
                                    <IonText className={classes.text}>
                                        {toTitleCase(hotel.name)}
                                    </IonText>
                                </IonRow>
                                <IonRow className={classes.popularityRow}>
                                    <IonBadge color="tertiary">
                                        {[...Array(hotel.rate).keys()].map(
                                            (i) => (
                                                <IonIcon
                                                    key={i}
                                                    icon={person}
                                                    color="primary"
                                                />
                                            )
                                        )}
                                    </IonBadge>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default OtherStaysPage;
