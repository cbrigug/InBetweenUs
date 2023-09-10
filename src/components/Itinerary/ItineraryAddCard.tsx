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

interface ItineraryAddCardProps {}

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

const ItineraryAddCard: React.FC<ItineraryAddCardProps> = ({}) => {
    const classes = useStyles();

    return (
        <IonCard className={`ion-no-margin ${classes.card}`} button>
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
                    <IonText className={classes.text}>Add day</IonText>
                </IonRow>
            </IonGrid>
        </IonCard>
    );
};

export default ItineraryAddCard;
