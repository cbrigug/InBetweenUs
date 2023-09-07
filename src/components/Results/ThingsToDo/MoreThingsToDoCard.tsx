import { IonCard, IonIcon, IonRippleEffect } from "@ionic/react";
import { ellipsisHorizontal } from "ionicons/icons";
import React from "react";
import { createUseStyles } from "react-jss";

interface MoreThingsToDoCardProps {
    navToThingsToDo: () => void;
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
    icon: {
        position: "absolute",
        bottom: "0px",
        top: "0px",
        left: "0px",
        right: "0px",
        margin: "auto",
        fontSize: "48px",
    },
});

const MoreThingsToDoCard: React.FC<MoreThingsToDoCardProps> = ({
    navToThingsToDo,
}) => {
    const classes = useStyles();

    return (
        <IonCard
            className={classes.card}
            color={"tertiary"}
            button={true}
            onClick={navToThingsToDo}
        >
            <IonRippleEffect />
            <IonIcon
                className={classes.icon}
                icon={ellipsisHorizontal}
                color="dark"
            />
        </IonCard>
    );
};

export default MoreThingsToDoCard;
