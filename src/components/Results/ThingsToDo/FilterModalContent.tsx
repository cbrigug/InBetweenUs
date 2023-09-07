import { IonCol, IonContent, IonGrid, IonRow } from "@ionic/react";
import React, { useState } from "react";
import {
    ionIconMap,
    faIconMap,
} from "./ActivityTypeIcon";
import ThingsToDoTypeCard from "./ThingsToDoTypeCard";

interface FilterModalContentProps {
    handleFilters: (filters: string[]) => void;
    activeFilters: string[];
}

const FilterModalContent: React.FC<FilterModalContentProps> = ({
    handleFilters,
    activeFilters
}) => {
    const [filters, setFilters] = useState<string[]>(activeFilters);

    const updateFilters = (filter: string) => {
        let updatedFilters = filters;

        if (filters.includes(filter)) {
            updatedFilters = filters.filter((f) => f !== filter);
        } else {
            updatedFilters.push(filter);
        }

        setFilters(updatedFilters);
        handleFilters(updatedFilters);
    };

    const types = Object.keys(ionIconMap).concat(Object.keys(faIconMap)).sort();
    types.push("Other");

    return (
        <IonContent className="ion-padding">
            <IonGrid>
                <IonRow>
                    {types.map((type) => {
                        return (
                            <IonCol
                                size="4"
                                key={type}
                                className="ion-no-padding ion-padding-bottom ion-text-center"
                            >
                                <ThingsToDoTypeCard
                                    type={type}
                                    updateFilters={updateFilters}
                                    isSelected={filters.includes(type)}
                                />
                            </IonCol>
                        );
                    })}
                </IonRow>
            </IonGrid>
        </IonContent>
    );
};

export default FilterModalContent;
