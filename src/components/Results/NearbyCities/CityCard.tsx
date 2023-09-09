import React, { useState } from "react";
import { City } from "../../../interfaces/City";
import { createUseStyles } from "react-jss";
import {
    IonCard,
    IonText,
    IonIcon,
    IonGrid,
    IonRow,
} from "@ionic/react";
import { arrowForward, arrowForwardCircle, image, informationCircle } from "ionicons/icons";
import ActivityTypeIcon from "../ThingsToDo/ActivityTypeIcon";
import ReactCardFlip from "react-card-flip";
import { convertSecondsToHoursMinutes } from "../../../utils/timeUtils";

interface CityCardProps {
    city: City;
}

const useStyles = createUseStyles({
    card: {
        height: "128px",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: "calc(var(--ion-margin, 16px) * 0.5)",
        marginRight: "calc(var(--ion-margin, 16px) * 0.5)",
        boxShadow: "none",
    },
    cityText: {
        fontWeight: "normal",
        fontSize: ".9rem",
    },
    // drivingText: {
    //     fontWeight: "normal",
    //     fontSize: ".9rem",
    // },
    iconBtn: {
        fontSize: "48px"
    },
    // backCard: {
    //     display: "flex",
    //     height: "100%",
    // },
    infoIcon: {
        fontSize: "24px",
        position: "absolute",
        top: "0px",
        right: "0px",
        margin: "calc(var(--ion-margin, 16px) * 0.5)",
    }
});

const CityCard: React.FC<CityCardProps> = ({ city }) => {
    const classes = useStyles();

    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            {/* Front of Card */}
            <IonCard
                className={classes.card}
                color={"tertiary"}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <IonGrid>
                    <IonRow className="ion-justify-content-center ion-margin-top">
                        <IonIcon className={classes.iconBtn} icon={arrowForwardCircle} color="primary" onClick={() => console.log("Here")} />
                    </IonRow>
                    <IonRow>
                        <IonText className={`ion-text-center ${classes.cityText}`}>
                            {city.title}
                        </IonText>
                    </IonRow>
                </IonGrid>
                <IonIcon icon={informationCircle} className={classes.infoIcon} color="secondary" />
            </IonCard>
            {/* Back of Card */}
            <IonCard
                className={classes.card}
                color={"tertiary"}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* <IonCardContent
                    className={`ion-justify-content-center ion-align-items-center ion-text-center ${classes.backCard}`}
                >
                    <IonText className={classes.backText} color={"dark"}>
                        {thingToDo.wikipedia_extracts
                            ? thingToDo.wikipedia_extracts.title.substring(3) // removes "en:"
                            : thingToDo.name}
                    </IonText>
                </IonCardContent> */}
            </IonCard>
        </ReactCardFlip>
    );
};

export default CityCard;
