import React from "react";
import { ShortCoords } from "../../../interfaces/City";
import {
    IonItem,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
} from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import Swiper from "swiper";
import { SwiperSlide } from "swiper/react";
import MoreThingsToDoCard from "../ThingsToDo/MoreThingsToDoCard";
import ThingToDoCard from "../ThingsToDo/ThingToDoCard";
import HotelCard from "./HotelCard";
import AirbnbCard from "./AirbnbCard";
import CheapestStayCard from "./CheapestStayCard";

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
                        <HotelCard />
                    </IonCol>
                    <IonCol size="4">
                        <AirbnbCard />
                    </IonCol>
                    <IonCol size="4">
                        <CheapestStayCard />
                    </IonCol>
                </IonRow>
            </IonGrid>
        </>
    );
};

export default PlacesToStaySection;
