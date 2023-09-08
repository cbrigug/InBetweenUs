import { IonCol, IonContent, IonGrid, IonRow } from "@ionic/react";
import React, { useState } from "react";
import {
    ionIconMap,
    faIconMap,
} from "./ActivityTypeIcon";
import ThingsToDoTypeCard from "./ThingsToDoTypeCard";

interface FilterModalContentProps {
    setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
    activeFilters: string[];
}

const FilterModalContent: React.FC<FilterModalContentProps> = ({
    setActiveFilters,
    activeFilters
}) => {
    const [filters, setFilters] = useState<string[]>(activeFilters);

    const updateFilters = (filter: string) => {
        let updatedFilters = filters;

        if (filters.includes(filter)) {
            updatedFilters = filters.filter((f) => f !== filter);
        } else {
            updatedFilters = [...updatedFilters, filter]
        }

        setFilters(updatedFilters);
        setActiveFilters(updatedFilters);
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
