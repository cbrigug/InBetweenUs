import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonText,
    IonTitle,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { ShortCoords } from "../../../interfaces/City";

interface HotelPageProps {
    coords: ShortCoords;
}

const HotelPage: React.FC = () => {
    const location = useLocation();

    const [coords, setCoords] = useState<ShortCoords>(
        (location.state as HotelPageProps)?.coords ?? {}
    );

    const [hotels, setHotels] = useState([]);

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
                        <IonText>Hotels</IonText>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
        </IonPage>
    );
};

export default HotelPage;
