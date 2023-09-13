import React from "react";
import { ShortCoords } from "../../../interfaces/City";
import {
    IonItem,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
} from "@ionic/react";
import PlaceToStayCard from "./PlaceToStayCard";

interface PlacesToStaySectionProps {
    coords: ShortCoords;
}

const PlacesToStaySection: React.FC<PlacesToStaySectionProps> = ({
    coords,
}) => {
    return (
        <>
            <IonItem lines="none">
                <IonText>Places to&nbsp;</IonText>
                <IonText color={"primary"}>stay</IonText>
            </IonItem>

            <IonGrid className="ion-no-padding">
                <IonRow
                    style={{
                        marginBottom: "calc(var(--ion-margin, 16px) * 0.25)",
                    }}
                >
                    <IonCol size="4">
                        <PlaceToStayCard type="hotel" coords={coords} />
                    </IonCol>
                    <IonCol size="4">
                        <PlaceToStayCard type="airbnb" coords={coords} />
                    </IonCol>
                    <IonCol size="4">
                        <PlaceToStayCard type="other" coords={coords} />
                    </IonCol>
                </IonRow>
            </IonGrid>
        </>
    );
};

export default PlacesToStaySection;
