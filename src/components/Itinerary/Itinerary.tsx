import {
    IonButton,
    IonButtons,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonModal,
    IonText,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { colorWand, home, newspaper } from "ionicons/icons";
import React, { useRef } from "react";
import ItineraryAddCard from "./ItineraryAddCard";

interface ItineraryProps {
    isOpen: boolean;
    toggleModal: () => void;
}

const Itinerary: React.FC<ItineraryProps> = ({ isOpen, toggleModal }) => {
    const modal = useRef<HTMLIonModalElement>(null);

    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={toggleModal}
            ref={modal}
            initialBreakpoint={0.95}
            breakpoints={[0.95, 0]}
        >
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonTitle>
                        <IonText>Itinerary</IonText>
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={toggleModal}>
                            <IonIcon
                                slot="icon-only"
                                icon={colorWand}
                                size="large"
                                color="dark"
                            />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <ItineraryAddCard />
            </IonContent>
        </IonModal>
    );
};

export default Itinerary;
