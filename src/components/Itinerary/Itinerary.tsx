import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonReorder,
    IonReorderGroup,
    IonText,
    IonTitle,
    IonToggle,
    IonToolbar,
} from "@ionic/react";
import { colorWand } from "ionicons/icons";
import React, { useRef, useState } from "react";
import ItineraryAddCard from "./ItineraryAddCard";
import ItineraryCard from "./ItineraryCard";

interface ItineraryProps {
    isOpen: boolean;
    toggleModal: () => void;
}

export interface ItineraryDay {
    id: number;
    morning: string;
    afternoon: string;
    evening: string;
}

const Itinerary: React.FC<ItineraryProps> = ({ isOpen, toggleModal }) => {
    const modalRef = useRef<HTMLIonModalElement>(null);
    const [days, setDays] = useState<ItineraryDay[]>([]);

    const [moveEnabled, setMoveEnabled] = useState(false);

    const addUpdateDay = (day: ItineraryDay) => {
        const updatedDays = [...days];
        const index = updatedDays.findIndex((d) => d.id === day.id);

        if (!day.morning && !day.afternoon && !day.evening) {
            updatedDays.splice(index, 1);
            setDays(updatedDays);
        } else {
            if (index === -1) {
                updatedDays.push(day);
            } else {
                updatedDays[index] = day;
            }
            setDays(updatedDays);
        }
    };

    const handleReorder = (event: CustomEvent) => {
        const updatedDays = event.detail.complete(days);

        setDays(updatedDays);
    };

    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={toggleModal}
            ref={modalRef}
            initialBreakpoint={0.95}
            breakpoints={[0.95, 0]}
        >
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonToggle
                            onIonChange={() => setMoveEnabled(!moveEnabled)}
                        />
                    </IonButtons>
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
                <ItineraryAddCard
                    index={
                        days.length > 0
                            ? Math.max(...days.map((day) => day.id)) + 1
                            : 1
                    } // get new id
                    addUpdateDay={addUpdateDay}
                />
                <IonReorderGroup
                    disabled={!moveEnabled}
                    onIonItemReorder={handleReorder}
                >
                    {days.map((day, i) => (
                        <IonReorder key={day.id}>
                            <ItineraryCard
                                position={i + 1}
                                day={day}
                                addUpdateDay={addUpdateDay}
                            />
                        </IonReorder>
                    ))}
                </IonReorderGroup>
            </IonContent>
        </IonModal>
    );
};

export default Itinerary;
