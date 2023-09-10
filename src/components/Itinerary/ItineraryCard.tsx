import React from "react";
import { ItineraryDay } from "./Itinerary";
import { createUseStyles } from "react-jss";
import { IonCard, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import ItineraryAddUpdate from "./ItineraryAddUpdate";

interface ItineraryCardProps {
    day: ItineraryDay;
    addUpdateDay: (day: ItineraryDay) => void;
}

const useStyles = createUseStyles({
    card: {
        height: "96px",
        backgroundColor: "var(--ion-color-tertiary)",
        borderRadius: "32px",
        boxShadow: "none",
    },
    row: {
        height: "96px",
    },
    text: {
        fontSize: "1rem",
    }
});

const ItineraryCard: React.FC<ItineraryCardProps> = ({ day, addUpdateDay }) => {
    const classes = useStyles();

    return (
        <IonCard className={`ion-no-margin ion-margin-top ${classes.card}`} button id={`present-alert-${day.index}`}>
            <IonGrid className="ion-no-padding ion-padding-horizontal">
                <IonRow className={classes.row}>
                    <IonCol size="3" className="ion-align-self-center">
                        <IonText color="primary">Day {day.index}</IonText>
                    </IonCol>
                    <IonCol size="9" className="ion-align-self-center">
                        <IonRow>
                            <IonText className={classes.text}>{day.morning}</IonText>
                        </IonRow>
                        <IonRow>
                            <IonText className={classes.text}>{day.afternoon}</IonText>
                        </IonRow>
                        <IonRow>
                            <IonText className={classes.text}>{day.evening}</IonText>
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonGrid>
            <ItineraryAddUpdate addUpdateDay={addUpdateDay} data={day} />
        </IonCard>
    );
};

export default ItineraryCard;
