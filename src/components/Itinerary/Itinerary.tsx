import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonText,
    IonTitle,
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
    index: number;
    morning: string;
    afternoon: string;
    evening: string;
  }
  
  const Itinerary: React.FC<ItineraryProps> = ({ isOpen, toggleModal }) => {
    const modalRef = useRef<HTMLIonModalElement>(null);
    const [days, setDays] = useState<ItineraryDay[]>([]);
  
    const addUpdateDay = (day: ItineraryDay) => {
      const updatedDays = [...days];
      const index = updatedDays.findIndex((d) => d.index === day.index);
  
      if (!day.morning && !day.afternoon && !day.evening) {
        // Remove the day if all fields are empty
        if (index !== -1) {
          updatedDays.splice(index, 1);
          setDays(updatedDays);
        }
      } else {
        if (index === -1) {
          updatedDays.push(day);
        } else {
          updatedDays[index] = day;
        }
        setDays(updatedDays);
      }
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
            <IonTitle>
              <IonText>Itinerary</IonText>
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={toggleModal}>
                <IonIcon slot="icon-only" icon={colorWand} size="large" color="dark" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <ItineraryAddCard index={days.length + 1} addUpdateDay={addUpdateDay} />
          {days.map((day) => (
            <ItineraryCard key={day.index} day={day} addUpdateDay={addUpdateDay} />
          ))}
        </IonContent>
      </IonModal>
    );
  };
  
  export default Itinerary;
  