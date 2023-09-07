import {
    IonItemSliding,
    IonItem,
    IonAvatar,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonIcon,
} from "@ionic/react";
import { globe, add } from "ionicons/icons";
import React, { useState } from "react";
import ActivityTypeIcon, { getSingleType } from "./ActivityTypeIcon";

interface ThingsToDoItemProps {
    thingToDo: any;
}


const ThingsToDoItem: React.FC<ThingsToDoItemProps> = ({
    thingToDo,
}) => {

    return (
        <IonItemSliding>
            <IonItem lines="inset">
                <IonAvatar slot="start">
                    <ActivityTypeIcon types={thingToDo.kinds} color="light" />
                </IonAvatar>
                <IonLabel className="ion-text-wrap">
                    {thingToDo.name}
                    <IonLabel color="primary" style={{ fontSize: "0.8rem" }}>
                        {getSingleType(thingToDo.kinds)
                            .charAt(0)
                            .toUpperCase() +
                            getSingleType(thingToDo.kinds).slice(1)}
                    </IonLabel>
                </IonLabel>
            </IonItem>

            <IonItemOptions side="start">
                <IonItemOption color="secondary">
                    <IonIcon icon={globe} color="light" size="large" />
                </IonItemOption>
            </IonItemOptions>

            <IonItemOptions side="end">
                <IonItemOption>
                    <IonIcon
                        icon={add}
                        color="light"
                        size="large"
                    />
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );
};

export default ThingsToDoItem;
