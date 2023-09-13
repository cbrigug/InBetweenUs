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

interface CheapestStaysPageProps {
    coords: ShortCoords;
}

const CheapestStaysPage: React.FC = () => {
    const location = useLocation();

    const [coords, setCoords] = useState<ShortCoords>(
        (location.state as CheapestStaysPageProps)?.coords ?? {}
    );

    const [cheapestStays, setCheapestStays] = useState([]);

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
                        <IonText color="primary">Cheapest&nbsp;</IonText>
                        <IonText>Stays</IonText>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
        </IonPage>
    );
};

export default CheapestStaysPage;
