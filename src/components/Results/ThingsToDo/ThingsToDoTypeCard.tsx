import { IonCard, IonText } from "@ionic/react";
import React, { useState } from "react";
import ActivityTypeIcon from "./ActivityTypeIcon";
import { capitalize } from "../../../utils/stringUtils";
import { createUseStyles } from "react-jss";

interface ThingsToDoTypeCardProps {
    type: string;
    updateFilters: (filter: string) => void;
    isSelected: boolean;
}

const useStyles = createUseStyles({
    card: {
        height: "92px",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: "calc(var(--ion-margin, 16px) * 0.5)",
        marginRight: "calc(var(--ion-margin, 16px) * 0.5)",
        boxShadow: "none",
    },
    text: {
        fontSize: "0.9rem",
        fontWeight: "normal",
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

const ThingsToDoTypeCard: React.FC<ThingsToDoTypeCardProps> = ({
    type,
    updateFilters,
    isSelected,
}) => {
    const classes = useStyles();

    const [selected, setSelected] = useState(isSelected);

    const handleSelect = () => {
        setSelected(!selected);
        updateFilters(type);
    };

    return (
        <>
            <IonCard
                className={classes.card}
                color={"tertiary"}
                onClick={handleSelect}
                style={{
                    border: selected
                        ? "2px solid var(--ion-color-primary)"
                        : "none",
                }}
            >
                <ActivityTypeIcon
                    types={type}
                    color="primary"
                    className={classes.icon}
                />
            </IonCard>
            <IonText className={classes.text} color="secondary">
                {capitalize(type)}
            </IonText>
        </>
    );
};

export default ThingsToDoTypeCard;
