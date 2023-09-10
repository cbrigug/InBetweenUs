import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    IonCard,
    IonCol,
    IonGrid,
    IonIcon,
    IonRippleEffect,
    IonRow,
    IonText,
} from "@ionic/react";
import React from "react";
import { createUseStyles } from "react-jss";
import ItineraryAddUpdate from "./ItineraryAddUpdate";
import { ItineraryDay } from "./Itinerary";

interface ItineraryAddCardProps {
    index: number;
    addUpdateDay: (day: ItineraryDay) => void;
}

const useStyles = createUseStyles({
    card: {
        height: "96px",
        backgroundColor: "var(--ion-color-tertiary)",
        borderRadius: "32px",
        boxShadow: "none",
    },
    icon: {
        fontSize: "26px",
    },
    text: {
        fontSize: "1rem",
        marginTop: "calc(var(--ion-margin, 16px) * .5)",
    },
});

const ItineraryAddCard: React.FC<ItineraryAddCardProps> = ({ index, addUpdateDay }) => {
    const classes = useStyles();

    return (
        <IonCard
            className={`ion-no-margin ${classes.card}`}
            button
            id="present-alert"
        >
            <IonRippleEffect />
            <IonGrid>
                <IonRow className="ion-justify-content-center ion-margin-top">
                    <FontAwesomeIcon
                        icon={faPencil}
                        className={classes.icon}
                        color="var(--ion-color-primary)"
                    />
                </IonRow>
                <IonRow className="ion-justify-content-center">
                    <IonText className={classes.text}>Add Day</IonText>
                </IonRow>
            </IonGrid>
            <ItineraryAddUpdate index={index} addUpdateDay={addUpdateDay} />
        </IonCard>
    );
};

export default ItineraryAddCard;
