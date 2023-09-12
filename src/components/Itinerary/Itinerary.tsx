import {
    IonAlert,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonLoading,
    IonModal,
    IonReorder,
    IonReorderGroup,
    IonText,
    IonTitle,
    IonToggle,
    IonToolbar,
    useIonToast,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import ItineraryAddCard from "./ItineraryAddCard";
import ItineraryCard from "./ItineraryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

import OpenAI from "openai";
import { environment } from "../../../environment.dev";

interface ItineraryProps {
    cityName: string;
    isOpen: boolean;
    toggleModal: () => void;
}

export interface ItineraryDay {
    id: number;
    morning: string;
    afternoon: string;
    evening: string;
}

export const getItineraryFromLocalStorage = (): ItineraryDay[] => {
    const savedDays = localStorage.getItem("itineraryDays");
    if (savedDays) {
        return JSON.parse(savedDays);
    } else {
        return [];
    }
};

export const saveToLocalStorage = (data: ItineraryDay[]) => {
    localStorage.setItem("itineraryDays", JSON.stringify(data));
};

const openAi = new OpenAI({
    apiKey: environment.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

const Itinerary: React.FC<ItineraryProps> = ({
    isOpen,
    toggleModal,
    cityName,
}) => {
    const modalRef = useRef<HTMLIonModalElement>(null);
    const [days, setDays] = useState<ItineraryDay[]>(
        getItineraryFromLocalStorage()
    );

    const [moveEnabled, setMoveEnabled] = useState(false);

    // Generate itinerary with AI
    const [numDays, setNumDays] = useState<number>();
    const [isLoading, setIsLoading] = useState(false);

    const [present] = useIonToast();
    const presentToast = (position: "top" | "middle" | "bottom") => {
        present({
            message: "Error occurred. Please try again.",
            duration: 1000,
            color: "danger",
            position: position,
        });
    };

    const addUpdateDay = (day: ItineraryDay) => {
        const updatedDays = [...days];
        const index = updatedDays.findIndex((d) => d.id === day.id);

        if (!day.morning && !day.afternoon && !day.evening) {
            // we only want to delete an index if it's found
            if (index !== -1) {
                updatedDays.splice(index, 1);
                setDays(updatedDays);
                saveToLocalStorage(updatedDays);
            }
        } else {
            if (index === -1) {
                updatedDays.push(day);
            } else {
                updatedDays[index] = day;
            }
            setDays(updatedDays);
            saveToLocalStorage(updatedDays);
        }
    };

    const handleReorder = (event: CustomEvent) => {
        const updatedDays = event.detail.complete(days);

        setDays(updatedDays);
        saveToLocalStorage(updatedDays);
    };

    const generateItinerary = async (numDays: number) => {
        setIsLoading(true);
        const content = `
            Give me ${numDays} days of things to do in ${cityName}.
            Return the result as a JSON array of objects like this:
            [{morning: "ActivityType | location", afternoon: "ActivityType | location", evening: "ActivityType | location"}]:
            the string "ActivityType | location" should be 25 chars or less as a whole.
            "location" should be specific unless it's a place to eat,
            then restrict it to the style of cuisine they serve. Use abbreviations
            when you can because we are limiting to 25 chars.
        `;

        try {
            // make request to openai
            const completion = await openAi.chat.completions.create({
                messages: [{ role: "user", content: content }],
                model: "gpt-3.5-turbo",
            });

            const results = JSON.parse(
                completion.choices[0].message.content as string
            );

            const resultsAsItineraryItem = results.map(
                (day: ItineraryDay, i: number) => {
                    return {
                        id: i + 1,
                        morning: day.morning,
                        afternoon: day.afternoon,
                        evening: day.evening,
                    };
                }
            );

            setDays(resultsAsItineraryItem);
            saveToLocalStorage(resultsAsItineraryItem);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            presentToast("bottom");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setDays(getItineraryFromLocalStorage());
        }
    }, [isOpen]);

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
                    <IonTitle className="ion-text-center">
                        <IonText>Itinerary</IonText>
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton id="reset-itinerary">
                            <FontAwesomeIcon
                                icon={faWandMagicSparkles}
                                size="xl"
                                color="black"
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
                <IonAlert
                    header="Generate Itinerary with AI"
                    subHeader="Warning: This will reset your itinerary."
                    trigger="reset-itinerary"
                    buttons={[
                        {
                            text: "Cancel",
                            role: "cancel",
                        },
                        {
                            text: "Confirm",
                            role: "confirm",
                            handler: (data) => {
                                const days = data.numDays;

                                if (days > 7 || days < 1) {
                                    return false;
                                } else {
                                    generateItinerary(days);
                                }
                            },
                        },
                    ]}
                    inputs={[
                        {
                            name: "numDays",
                            type: "number",
                            placeholder: "Number of days (max: 7)",
                            value: numDays,
                        },
                    ]}
                ></IonAlert>
                <IonLoading isOpen={isLoading} />
            </IonContent>
        </IonModal>
    );
};

export default Itinerary;
