import { IonCard, IonIcon, IonText, IonCardContent } from "@ionic/react";
import { image } from "ionicons/icons";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import ActivityTypeIcon from "./ActivityTypeIcon";
import ReactCardFlip from "react-card-flip";

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
        boxShadow: "none",
        border: "1px solid var(--ion-color-tertiary)",
    },
    image: {
        height: "100%",
        objectFit: "cover",
        zIndex: -1,
    },
    frontText: {
        background: "radial-gradient(black, transparent)",
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
        paddingLeft: "calc(var(--ion-padding, 16px) * 0.125)", // no text against the edge
        paddingRight: "calc(var(--ion-padding, 16px) * 0.125)",
    },
    backText: {
        fontWeight: "normal",
        fontSize: ".9rem",
    },
    icon: {
        position: "absolute",
        bottom: "0px",
        top: "0px",
        left: "0px",
        right: "0px",
        margin: "auto",
    },
    backCard: {
        display: "flex",
        height: "100%",
    },
});

const ThingToDoCard: React.FC<ThingToDoCardProps> = ({ thingToDo }) => {
    const classes = useStyles();

    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            {/* Front of Card */}
            <IonCard
                className={classes.card}
                color={"tertiary"}
                style={{
                    backgroundImage: `url(${thingToDo.preview?.source})` ?? "",
                }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {thingToDo.preview ? (
                    <IonText className={classes.frontText} color={"light"}>
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
                        <IonText className={classes.frontText} color={"light"}>
                            {thingToDo.name}
                        </IonText>
                    </>
                )}
                <ActivityTypeIcon types={thingToDo.kinds} color="light" />
            </IonCard>
            {/* Back of Card */}
            <IonCard
                className={classes.card}
                color={"tertiary"}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <IonCardContent
                    className={`ion-justify-content-center ion-align-items-center ion-text-center ${classes.backCard}`}
                >
                    <IonText className={classes.backText} color={"dark"}>
                        {thingToDo.wikipedia_extracts
                            ? thingToDo.wikipedia_extracts.title.substring(3) // removes "en:"
                            : thingToDo.name}
                    </IonText>
                </IonCardContent>
            </IonCard>
        </ReactCardFlip>
    );
};

export default ThingToDoCard;
