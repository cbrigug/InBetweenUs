import { faAirbnb } from "@fortawesome/free-brands-svg-icons";
import {
    faBed,
    faDollarSign,
    faHotel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IonCard, IonRippleEffect, IonRow, IonText } from "@ionic/react";
import React from "react";
import { createUseStyles } from "react-jss";
import { capitalize } from "../../../utils/stringUtils";
import { useHistory } from "react-router";
import { ShortCoords } from "../../../interfaces/City";

interface PlaceToStayCardProps {
    type: "hotel" | "airbnb" | "cheapest";
    coords: ShortCoords;
}

const useStyles = createUseStyles({
    card: {
        height: "96px",
        borderRadius: "16px",
        boxShadow: "none",
        marginLeft: "calc(var(--ion-margin, 16px) * 0.5)",
        marginRight: "calc(var(--ion-margin, 16px) * 0.5)",
    },
    icon: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
    },
    text: {
        fontSize: "1rem",
        fontWeight: "normal",
    },
});

const PlaceToStayCard: React.FC<PlaceToStayCardProps> = ({ type, coords }) => {
    const classes = useStyles();

    const history = useHistory();

    const navPlacesToStayPages = () => {
        history.push(`/results/${type}`, {
            coords,
        });
    };

    const typeToIcon = {
        hotel: faHotel,
        airbnb: faAirbnb,
        cheapest: faDollarSign,
    };

    const selectedIcon = typeToIcon[type];

    return (
        <>
            <IonCard
                className={`ion-no-margin ${classes.card}`}
                color="tertiary"
                button
                onClick={navPlacesToStayPages}
                disabled={type === "airbnb"}
            >
                <IonRippleEffect />
                <FontAwesomeIcon
                    className={classes.icon}
                    icon={selectedIcon}
                    size="2x"
                />
            </IonCard>
            <IonRow className="ion-justify-content-center">
                <IonText
                    className={classes.text}
                    style={{ opacity: type === "airbnb" ? 0.25 : 1 }} // AirBnb is currently not supported
                >
                    {capitalize(type)}
                </IonText>
            </IonRow>
        </>
    );
};

export default PlaceToStayCard;
