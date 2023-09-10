import { IonAlert } from "@ionic/react";
import React from "react";
import { ItineraryDay } from "./Itinerary";

interface ItineraryAddUpdateProps {
    addUpdateDay: (day: ItineraryDay) => void;
    index?: number; // need for ItineraryAddCard
    data?: ItineraryDay; // need for ItineraryCard
}

const ItineraryAddUpdate: React.FC<ItineraryAddUpdateProps> = ({
    addUpdateDay,
    index,
    data,
}) => {
    return (
        <IonAlert
            animated
            trigger={index ? "present-alert" : `present-alert-${data?.index}`}
            header={index ? "Add Day" : `Day ${data?.index}`}
            buttons={[
                {
                    text: "Cancel",
                    role: "cancel",
                },
                {
                    text: index ? "Add" : "Update",
                    handler: (val) => {
                        addUpdateDay({
                            index: index ? index : data?.index,
                            ...val,
                        });
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
                    value: data?.morning,
                },
                {
                    name: "afternoon",
                    type: "text",
                    placeholder: "Afternoon",
                    attributes: {
                        maxLength: 30,
                    },
                    value: data?.afternoon,
                },
                {
                    name: "evening",
                    type: "text",
                    placeholder: "Evening",
                    attributes: {
                        maxLength: 30,
                    },
                    value: data?.evening,
                },
            ]}
        />
    );
};

export default ItineraryAddUpdate;
