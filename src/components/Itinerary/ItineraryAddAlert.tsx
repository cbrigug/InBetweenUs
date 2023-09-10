import { IonAlert } from "@ionic/react";
import React from "react";

interface ItineraryAddAlertProps {
    index: number;
}

const ItineraryAddAlert: React.FC<ItineraryAddAlertProps> = ({ index }) => {
    return (
        <IonAlert
            trigger="present-alert"
            header={`Day ${index}`}
            buttons={[
                {
                    text: "Cancel",
                    role: "cancel",
                },
                {
                    text: "Add",
                    handler: (data) => {
                        console.log(data);
                    },
                },
            ]}
            inputs={[
                {
                    name: "morning",
                    type: "text",
                    placeholder: "Morning",
                    attributes: {
                        maxLength: 30,
                    },
                },
                {
                    name: "afternoon",
                    type: "text",
                    placeholder: "Afternoon",
                    attributes: {
                        maxLength: 30,
                    },
                },
                {
                    name: "evening",
                    type: "text",
                    placeholder: "Evening",
                    attributes: {
                        maxLength: 30,
                    },
                },
            ]}
            onSubmit={(data) => {
                console.log(data);
            }}
        ></IonAlert>
    );
};

export default ItineraryAddAlert;
