import {
    IonCard,
    IonCol,
    IonIcon,
    IonSpinner,
    IonRow,
    IonText,
} from "@ionic/react";
import { image } from "ionicons/icons";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import ActivityTypeIcon from "./ActivityTypeIcon";

interface ThingToDoCardProps {
    thingToDo: any;
}

const useStyles = createUseStyles({
    card: {
        height: "128px",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: "calc(var(--ion-margin, 16px) * 0.5)",
        marginRight: "calc(var(--ion-margin, 16px) * 0.5)",
        backgroundSize: "cover",
    },
    image: {
        height: "100%",
        objectFit: "cover",
        zIndex: -1,
    },
    text: {
        fontWeight: "normal",
        backdropFilter: "brightness(0.5)",
        fontSize: ".9rem",
        position: "absolute",
        bottom: "0px",
        marginBottom: "calc(var(--ion-margin, 16px) * 0.5)",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        display: "-webkit-box",
        width: "100%",
        textAlign: "center",
    },
    icon: {
        position: "absolute",
        bottom: "0px",
        top: "0px",
        left: "0px",
        right: "0px",
        margin: "auto",
    },
});

const ThingToDoCard: React.FC<ThingToDoCardProps> = ({ thingToDo }) => {
    const classes = useStyles();

    return (
        <IonCard
            className={classes.card}
            color={"tertiary"}
            style={{
                backgroundImage: `url(${thingToDo.preview?.source})` ?? "",
            }}
        >
            {thingToDo.preview ? (
                <IonText className={classes.text} color={"light"}>
                    {thingToDo.name}
                </IonText>
            ) : (
                <>
                    <IonIcon
                        className={classes.icon}
                        icon={image}
                        size="large"
                        color="secondary"
                    />
                    <IonText className={classes.text} color={"light"}>
                        {thingToDo.name}
                    </IonText>
                </>
            )}
            <ActivityTypeIcon types={thingToDo.kinds} />
        </IonCard>
    );
};

export default ThingToDoCard;
