import React, { useState } from "react";
import { City } from "../../../interfaces/City";
import { createUseStyles } from "react-jss";
import {
    IonCard,
    IonText,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
} from "@ionic/react";
import {
    arrowForward,
    arrowForwardCircle,
    image,
    informationCircle,
} from "ionicons/icons";
import ActivityTypeIcon from "../ThingsToDo/ActivityTypeIcon";
import ReactCardFlip from "react-card-flip";
import { convertSecondsToHoursMinutes } from "../../../utils/timeUtils";
import Avatar from "../../Avatar";
import { FormDataType } from "../../Home/PersonCard/PersonModal";

interface CityCardProps {
    personA: FormDataType;
    personB: FormDataType;
    city: City;
    setCurrentCity: (city: City) => void;
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
    drivingText: {
        fontWeight: "normal",
        // fontSize: ".9rem",
    },
    iconBtn: {
        fontSize: "48px",
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
    },
    line: {
        height: "1px",
        backgroundColor: "rgba(var(--ion-color-secondary-rgb), 0.25)",
        marginTop: "calc(var(--ion-margin, 16px) * 0.5)",
        marginBottom: "calc(var(--ion-margin, 16px) * 0.5)",
    },
});

const CityCard: React.FC<CityCardProps> = ({
    city,
    personA,
    personB,
    setCurrentCity,
}) => {
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
                        <IonIcon
                            className={classes.iconBtn}
                            icon={arrowForwardCircle}
                            color="primary"
                            onClick={() => setCurrentCity(city)}
                        />
                    </IonRow>
                    <IonRow>
                        <IonText
                            className={`ion-text-center ${classes.cityText}`}
                        >
                            {city.title}
                        </IonText>
                    </IonRow>
                </IonGrid>
                <IonIcon
                    icon={informationCircle}
                    className={classes.infoIcon}
                    color="secondary"
                />
            </IonCard>
            {/* Back of Card */}
            <IonCard
                className={classes.card}
                color={"tertiary"}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <IonGrid>
                    <IonRow>
                        <Avatar
                            name={personA.name}
                            image={personA.photo ?? undefined}
                            size={"48px"}
                            textSize="1.5rem"
                        />
                        <IonText
                            className="ion-align-self-center ion-padding-start"
                            color="secondary"
                        >
                            {convertSecondsToHoursMinutes(city.drivingTimeA)}
                        </IonText>
                    </IonRow>
                    <IonRow
                        className={`ion-margin-horizontal ${classes.line}`}
                    />
                    <IonRow className="ion-justify-content-end">
                        <IonText
                            className="ion-align-self-center ion-padding-end"
                            color="secondary"
                        >
                            {convertSecondsToHoursMinutes(city.drivingTimeB)}
                        </IonText>
                        <Avatar
                            name={personB.name}
                            image={personB.photo ?? undefined}
                            size={"48px"}
                            textSize="1.5rem"
                        />
                    </IonRow>
                </IonGrid>
            </IonCard>
        </ReactCardFlip>
    );
};

export default CityCard;
